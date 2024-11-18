import math
import random

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import streamlit as st
from scipy.stats import weibull_min

st.title("Novel Disease Simulation")
st.write("On 17 Nov 2019, the first confirmed case of COVID-19 was reported in Wuhan, China. However, at the time, we had no idea what the disease was and it took approximiately 6 weeks from then to realise there was an outbreak.")
st.write("What if there was a way for us to have detected the outbreak earlier?")
st.write("This app simulates the spread of a novel disease in a given London borough and shows how quickly we could have detected it if we had a testing regime in place.")

# Disease characteristics
N = 9000000

# Import hospital data
@st.cache_data  # Cache the data loading to improve performance
def load_hospital_data():
    df = pd.read_csv('london_hospitals.csv')
    return df

# Load the data
hospitals_df = load_hospital_data()
hospitals_df.sort_values(by='patients_per_day', ascending=False, inplace=True)

st.markdown("### Clinical metagenomic sequencing")
st.write("Clinical metagenomic sequencing is a technique that allows us to sequence the DNA of pathogens directly from clinical samples. This is a powerful tool for detecting novel pathogens for which we don't have a specific diagnostic test.")
num_hospitals = st.slider(
        "Surveillance Coverage", 
        min_value=1, 
        max_value=20, 
        value=20,
        help="Number of hospitals which run clinical metagenomic sequencing"
    )
total_patients_covered = hospitals_df['patients_per_day'].iloc[:num_hospitals].sum()
TOTAL_DAILY_PATIENTS = 12760
p_coverage = total_patients_covered/TOTAL_DAILY_PATIENTS
p_testing = 0.8 # Fraction of hospitalised individuals tested
st.write(f"If {num_hospitals} of the busiest London hospitals were running clinical metagenomic sequencing on {p_testing*100:.0f}% of their patients, this would cover {p_coverage*100*p_testing:.2f}% of all patients in London")

tests_per_day = TOTAL_DAILY_PATIENTS * p_testing * p_coverage
COST_PER_TEST = 300  # in pounds
col1, col2 = st.columns(2)
with col1:
    st.metric(
        label="Test per day",
        value=f"{int(np.mean(tests_per_day)):,}"
    )

with col2:
    total_cost = tests_per_day * COST_PER_TEST
    st.metric(
        label="Testing cost per day",
        value=f"£{total_cost:,.0f}",
        help="Based on £300 per test"
    )


# Add this after the title and introduction, before the simulation
st.markdown("### Disease Characteristics")
st.write("The default parameters are based on the early onset of COVID-19")
# First row of parameters
col1, col2, col3 = st.columns(3)

with col1:
    r0 = st.slider(
        "Basic Reproduction Number (R0)", 
        min_value=0.5, 
        max_value=10.0, 
        value=2.5,
        step=0.5,
        help="Average number of secondary infections caused by one infected person"
    )


with col2:
    incubation_period = st.slider(
        "Incubation Period (days)", 
        min_value=1, 
        max_value=14, 
        value=4,
        help="Time from infection to symptoms"
    )

with col3:
    infectious_period = st.slider(
        "Infectious Period (days)", 
        min_value=1, 
        max_value=21, 
        value=10,
        help="Duration of infectiousness"
    )


if st.button("Reset to COVID-19 Values"):
    # Reset all parameters to their default values
    st.session_state.incubation_period = 4
    st.session_state.r0 = 2.5
    st.session_state.infectious_period = 10
    st.session_state.fatality_rate = 0.01
    st.rerun()

# Calculate transmission probability
daily_contacts = 20  # Fixed
transmission_prob = r0 / (daily_contacts * infectious_period)
median_hospitalisation_time = incubation_period + infectious_period/2 

# Simulation parameters
simulation_days = st.slider("Simulation Days", 
                          min_value=10, 
                          max_value=100, 
                          value=6*7, 
                          step=1)

# Testing parameters
sensitivity = st.session_state.get('sensitivity', 0.85) # rate of hospitalised to tested positive

def get_hospitalisation_probability(days_infected):
    """Calculate hospitalisation probability for given days since infection, given no recovery"""
    time_since_symptoms = days_infected - incubation_period
    
    shape_param = 2.5  # Increasing hazard

    return np.where(
        time_since_symptoms < 0,
        0,
        weibull_min.cdf(time_since_symptoms, shape_param, scale=median_hospitalisation_time)
    )

def get_recovery_probability(days_infected):
    """Calculate recovery probability for given days since infection"""
    scale_param = incubation_period + infectious_period
    shape_param = 1.5  # Typical value for modeling recovery times
    return weibull_min.cdf(days_infected, shape_param, scale=scale_param)

@st.cache_resource
def run_simulations(n_sims, days, r0, incubation_period, infectious_period, 
                   p_coverage, p_testing, sensitivity):
    """Run multiple simulations with caching"""
    # Pre-calculate probabilities for all days
    days_range = np.arange(days + 1)
    
    # Pre-calculate all probabilities using the functions
    recovery_probabilities = get_recovery_probability(days_range)
    hosp_probabilities = get_hospitalisation_probability(days_range)
    
    all_sims = []
    all_hosps = []
    all_tests = []
    all_recov = []
    
    for _ in range(n_sims):
        infected, hosps, tests, recov = monte_carlo_simulation(
            days,
            recovery_probabilities, hosp_probabilities
        )
        all_sims.append(infected)
        all_hosps.append(hosps)
        all_tests.append(tests)
        all_recov.append(recov)
    
    return all_sims, all_hosps, all_tests, all_recov

def monte_carlo_simulation(days,
                         recovery_probabilities, hosp_probabilities):
    # Pre-allocate arrays
    infected = np.zeros(days + 1, dtype=np.int32)
    hospitalized = np.zeros(days + 1, dtype=np.int32)
    tested = np.zeros(days + 1, dtype=np.int32)
    recovered = np.zeros(days + 1, dtype=np.int32)
    
    # Initial conditions
    infected[0] = 1
    active_cases = 1
    infection_days = np.array([0])  # When each person was infected
    
    for day in range(days):
        if active_cases == 0:
            # Copy forward if no active cases
            infected[day+1:] = infected[day]
            hospitalized[day+1:] = hospitalized[day]
            tested[day+1:] = tested[day]
            recovered[day+1:] = recovered[day]
            break
            
        # Calculate days since infection for active cases
        days_infected = day - infection_days
        
        # Use pre-calculated probabilities
        recovery_mask = np.random.random(len(days_infected)) < recovery_probabilities[days_infected]
        hosp_mask = ~recovery_mask & (np.random.random(len(days_infected)) < hosp_probabilities[days_infected])
        
        # Update counts
        new_recoveries = np.sum(recovery_mask)
        new_hosps = np.sum(hosp_mask)
        
        # Testing for hospitalized cases
        if new_hosps > 0:
            test_probs = np.random.random(new_hosps)
            new_tests = np.sum((test_probs < p_coverage) & 
                             (test_probs < p_testing) & 
                             (test_probs < sensitivity))
        else:
            new_tests = 0
            
        # Calculate new infections
        remaining_active = ~(recovery_mask | hosp_mask)
        n_infectious = np.sum(remaining_active)
        
        if n_infectious > 0:            
            # Calculate maximum possible new infections based on remaining susceptible population
            susceptible = N - (infected[day] + recovered[day] + hospitalized[day])
            total_contacts = min(daily_contacts, susceptible)
            
            # Calculate new cases using fixed contacts
            if total_contacts > 0:
                transmissions = np.random.random(total_contacts) < transmission_prob
                new_cases = np.sum(transmissions)
            else:
                new_cases = 0
        else:
            new_cases = 0
            
        # Update arrays
        infected[day+1] = min(infected[day] + new_cases, N)
        hospitalized[day+1] = hospitalized[day] + new_hosps
        tested[day+1] = tested[day] + new_tests
        recovered[day+1] = recovered[day] + new_recoveries
        
        # Update active cases and infection days
        if new_cases > 0:
            infection_days = np.append(infection_days[remaining_active], 
                                     np.full(new_cases, day))
        else:
            infection_days = infection_days[remaining_active]
            
        active_cases = len(infection_days)
    
    return infected, hospitalized, tested, recovered

# Run simulations with caching
n_simulations = 10  # Reduced number of simulations
all_simulations, all_hospitalisations, all_tested_positive, all_recovered = run_simulations(
    n_simulations, simulation_days, r0, incubation_period, infectious_period, 
    p_coverage, p_testing, sensitivity
)

# Display final statistics
final_infections = [sim[-1] for sim in all_simulations]
final_hospitalisations = [hosp[-1] for hosp in all_hospitalisations]
final_tested = [tested[-1] for tested in all_tested_positive]
final_recovered = [recovered[-1] for recovered in all_recovered]

# Calculate first positive case day for each simulation
first_positive_days = []
for tested_cases in all_tested_positive:
    # Find first day with a positive case
    try:
        first_day = next(day for day, cases in enumerate(tested_cases) if cases > 0)
        first_positive_days.append(first_day)
    except StopIteration:
        first_positive_days.append(simulation_days)  # No cases found

# Display statistics in a nice card layout
st.markdown("### Simulation Results")
st.write(f"Averaged values over {n_simulations} simulations")
col1, col2, col3 = st.columns(3)  # First row

with col1:
    covid_detection_time = 42  # 6 weeks * 7 days
    days_earlier = covid_detection_time - np.mean(first_positive_days)
    
    st.metric(
        label="First Positive Case",
        value=f"Day {int(np.mean(first_positive_days))}",
        delta=f"{days_earlier:.1f} days earlier than COVID",
        delta_color="normal",
        help="COVID-19 took 6 weeks to be detected in Wuhan"
    )


# Add second row of metrics
col4, col5, col6 = st.columns(3)  # Second row

with col4:
    final_infections = [sim[-1] for sim in all_simulations]
    st.metric(
        label="Total Infected",
        value=f"{int(np.mean(final_infections)):,}",
        help="Final number of infected cases"
    )

with col5:
    final_recovered = [rec[-1] for rec in all_recovered]
    st.metric(
        label="Total Recovered",
        value=f"{int(np.mean(final_recovered)):,}",
        help="Final number of recovered cases"
    )

with col6:
    final_hospitalisations = [hosp[-1] for hosp in all_hospitalisations]
    st.metric(
        label="Total Hospitalized",
        value=f"{int(np.mean(final_hospitalisations)):,}",
        help="Final number of hospitalized cases"
    )

# Plot results
fig, ax = plt.subplots(figsize=(10, 6))

average_infected = np.mean(all_simulations, axis=0)
average_hospitalized = np.mean(all_hospitalisations, axis=0)
average_tested = np.mean(all_tested_positive, axis=0)
average_recovered = np.mean(all_recovered, axis=0)

ax.plot(range(simulation_days + 1), average_infected, 
        color='blue', linewidth=2, label='Total Infected')
ax.plot(range(simulation_days + 1), average_hospitalized, 
        color='red', linewidth=2, label='Hospitalized')
ax.plot(range(simulation_days + 1), average_tested, 
        color='green', linewidth=2, label='Tested Positive')
ax.plot(range(simulation_days + 1), average_recovered, 
        color='purple', linewidth=2, label='Recovered')

ax.set_xlabel('Days')
ax.set_ylabel('Number of People')
ax.set_title(f'Disease Spread in London')
ax.legend()

st.pyplot(fig)

# Add this after your other plots
st.markdown("### hospitalisation Probability Over Time")
days = np.linspace(0, infectious_period * 2, 100)
probabilities = get_hospitalisation_probability(days)

fig2, ax = plt.subplots(figsize=(10, 4))
ax.plot(days, probabilities, 'b-', linewidth=2)
ax.axvline(x=incubation_period, color='r', linestyle='--', label='Symptoms Onset')
ax.axvline(x=infectious_period, color='orange', linestyle='--', label='End of Infectious Period')

ax.set_xlabel('Days Since Infection')
ax.set_ylabel('Probability of hospitalisation')
ax.set_title('hospitalisation Probability Over Time')
ax.grid(True)
ax.legend()

# Calculate maximum probability for text placement
max_prob = np.max(probabilities)
text_y_pos = max_prob * 0.1  # Place text at 10% of max height

# Add labels for key points with adjusted y-position
ax.text(incubation_period, text_y_pos, f'Day {incubation_period}\nSymptoms', 
        rotation=90, ha='right', va='bottom')
ax.text(median_hospitalisation_time, text_y_pos, f'Day {median_hospitalisation_time:.1f}\nPeak', 
        rotation=90, ha='right', va='bottom')
ax.text(infectious_period, text_y_pos, f'Day {infectious_period}\nEnd', 
        rotation=90, ha='right', va='bottom')

# Set y-axis limits to show full curve plus some padding
ax.set_ylim(0, max_prob * 1.2)

st.pyplot(fig2)

# Add this after your other plots to visualize the recovery probability
st.markdown("### Recovery Probability Over Time")
days = np.linspace(0, infectious_period * 2, 100)
recovery_probs = get_recovery_probability(days)

fig3, ax = plt.subplots(figsize=(10, 4))
ax.plot(days, recovery_probs, 'purple', linewidth=2)
ax.axvline(x=incubation_period, color='r', linestyle='--', label='Symptoms Onset')
ax.axvline(x=incubation_period + infectious_period, color='g', linestyle='--', label='Mean Recovery')

ax.set_xlabel('Days Since Infection')
ax.set_ylabel('Probability of Recovery')
ax.set_title('Recovery Probability Over Time')
ax.grid(True)
ax.legend()

# Calculate maximum probability for text placement
max_prob = np.max(recovery_probs)
text_y_pos = max_prob * 0.1  # Place text at 10% of max height

# Add labels for key points
ax.text(incubation_period, text_y_pos, f'Day {incubation_period}\nSymptoms Onset', 
        rotation=90, ha='right', va='bottom')
ax.text(incubation_period + infectious_period, text_y_pos, f'Day {incubation_period + infectious_period}\nMean Recovery', 
        rotation=90, ha='right', va='bottom')

# Set y-axis limits
ax.set_ylim(0, 1.1)  # Recovery probability is a CDF, so max is 1

st.pyplot(fig3)








