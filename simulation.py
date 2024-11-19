import math
import random

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import streamlit as st
from scipy.stats import weibull_min

# Constants and configuration
N = 100  
TOTAL_DAILY_PATIENTS = 12760
COST_PER_TEST = 300
DEFAULT_DAILY_CONTACTS = 10
TEST_SENSITIVITY = 0.85
PROPORTION_OF_PATIENTS_TESTED = 0.8

# Import hospital data
@st.cache_data  # Cache the data loading to improve performance
def load_hospital_data():
    df = pd.read_csv('london_hospitals.csv')
    df.sort_values(by='patients_per_day', ascending=False, inplace=True)
    return df

# Probability functions
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
    return 0.01

st.title("Novel Disease Simulation")
st.write("On 17 Nov 2019, the first confirmed case of COVID-19 was reported in Wuhan, China. However, at the time, we had no idea what the disease was and it took approximiately 6 weeks from then to realise there was an outbreak.")
st.write("What if there was a way for us to have detected the outbreak earlier?")
st.write("This app simulates the spread of a novel disease in a given London borough and shows how quickly we could have detected it if we had a testing regime in place.")

st.markdown("### Clinical metagenomic sequencing")
st.write("Clinical metagenomic sequencing is a technique that allows us to sequence the DNA of pathogens directly from clinical samples. This is a powerful tool for detecting novel pathogens for which we don't have a specific diagnostic test.")
num_hospitals = st.slider(
        "Surveillance Coverage", 
        min_value=1, 
        max_value=20, 
        value=20,
        help="Number of hospitals which run clinical metagenomic sequencing"
    )

# Load the data
hospitals_df = load_hospital_data()
total_patients_covered = hospitals_df['patients_per_day'].iloc[:num_hospitals].sum()
p_coverage = total_patients_covered/TOTAL_DAILY_PATIENTS
st.write(f"If {num_hospitals} of the busiest London hospitals were running clinical metagenomic sequencing on {PROPORTION_OF_PATIENTS_TESTED*100:.0f}% of their patients, this would cover {p_coverage*100*PROPORTION_OF_PATIENTS_TESTED:.2f}% of all patients in London")

tests_per_day = TOTAL_DAILY_PATIENTS * PROPORTION_OF_PATIENTS_TESTED * p_coverage
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
col1, col2 = st.columns(2)

with col1:
    transmission_prob = st.slider(
        "Transmission Probability", 
        min_value=0.0, 
        max_value=1.0, 
        value=0.1,
        step=0.01,
        help="Probability of infection per contact"
    )

with col2:
    incubation_period = st.slider(
        "Incubation Period (days)", 
        min_value=1, 
        max_value=14, 
        value=4,
        help="Time from infection to symptoms"
    )

col3, col4 = st.columns(2)

with col3:
    infectious_period = st.slider(
        "Infectious Period (days)", 
        min_value=1, 
        max_value=21, 
        value=10,
        help="Duration of infectiousness"
    )

with col4:
    fatality_rate = st.slider(
        "Fatality Rate", 
        min_value=0.0, 
        max_value=1.0, 
        value=0.1,
        help="Probability of death"
    )

# Simulation parameters
simulation_days = st.slider("Simulation Days", 
                          min_value=10, 
                          max_value=100, 
                          value=30, 
                          step=1)


def monte_carlo_simulation(days_range):
    # Initial conditions
    susceptible = [N-1]
    infected = [1]
    removed = [0]
    positive = [0]
    
    for day in days_range:
        new_infections = 0
        new_hospitalisations = 0
        new_positives = 0
        new_removals = 0
        
        for i in range(infected[-1]):
            # Newly infected contacts
            remaining_susceptible = susceptible[-1] - new_infections
            if remaining_susceptible > 0:
                new_contacts = min(np.random.randint(5,30), remaining_susceptible)
                for contact in range(new_contacts):
                    if np.random.random() < transmission_prob:
                        new_infections +=1

            # Removal
            if np.random.random() < fatality_rate: # Probability of recovery / death
                new_removals += 1
            elif np.random.random() < 0.1: # Probability of hospitalisation
                new_hospitalisations += 1
            
        # Testing for hospitalized cases
        if new_hospitalisations > 0:
            for h in range(new_hospitalisations):
                if np.random.random() < p_coverage:
                    if np.random.random() < TEST_SENSITIVITY:
                        new_positives += 1
        
        # Log the day's results
        susceptible.append(susceptible[-1] - new_infections)
        infected.append(infected[-1] + new_infections - new_hospitalisations - new_removals)
        removed.append(removed[-1] + new_removals + new_hospitalisations)
        positive.append(positive[-1] + new_positives)
    
    return susceptible, infected, removed, positive

# Run simulations
num_simulations = 10
cumulative_infected, all_positive, first_positive_days = [], [], []
for _ in range(num_simulations):
    susceptible, infected, removed, positive = monte_carlo_simulation(np.arange(simulation_days)) 
    cumulative_infected.append(np.array(infected) + np.array(removed))
    all_positive.append(positive)
    
    # Find first day with non-zero positive cases
    first_positive_days = next(
        (day for day, count in enumerate(positive) if count > 0), 
        None  # return None if no positives found
    )

# Average the results
average_cumulative_infected = np.mean(cumulative_infected, axis=0)
average_positive = np.mean(all_positive, axis=0)    
average_first_positive_days = np.mean(first_positive_days)

# Display statistics in a nice card layout
st.markdown("### Simulation Results")
col1, col2, col3 = st.columns(3)  # First row

with col1:
    covid_detection_time = 42  # 6 weeks * 7 days
    days_earlier = covid_detection_time - first_positive_days
    
    st.metric(
        label="First Positive Case",
        value=f"Day {int(average_first_positive_days)}",
        delta=f"{days_earlier:.1f} days earlier than COVID",
        delta_color="normal",
        help="COVID-19 took 6 weeks to be detected in Wuhan"
    )


# Add second row of metrics
col4, col5 = st.columns(2)  # Second row

with col4:
    st.metric(
        label="Total Infected",
        value=int(cumulative_infected[-1]),  # Get last value and convert to int
        help="Final number of infected cases"
    )

with col5:
    st.metric(
        label="Tested Positive",
        value=average_positive,
        help="Total tested positive"
    )

# Plot results
fig, ax = plt.subplots(figsize=(10, 6))

ax.plot(range(simulation_days + 1), average_cumulative_infected, 
        color='darkred', linewidth=2, label='Total ever infected')
ax.plot(range(simulation_days + 1), average_positive, 
        color='green', linewidth=2, label='Total tested positive')

# Add vertical line for detection day if disease was detected
if average_first_positive_days is not None:
    ax.axvline(x=average_first_positive_days, color='black', linestyle='--', 
               label=f'First Detection (Day {average_first_positive_days})')
    ax.text(first_positive_days + 0.5, ax.get_ylim()[1] * 0.95, 
            f'Detection: Day {first_positive_days}', 
            rotation=90, verticalalignment='top')

ax.set_xlabel('Days')
ax.set_ylabel('Number of People')
ax.set_title(f'Disease Spread in London')
ax.legend()

st.pyplot(fig)







