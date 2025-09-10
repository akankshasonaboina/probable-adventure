import streamlit as st
import requests
import json
import base64
from typing import Dict, Any

# Configure page
st.set_page_config(
    page_title="Personal Finance Chatbot",
    page_icon="💰",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for frosted glass effect
def set_background():
    st.markdown("""
    <style>
    .main {
        padding: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
    }
    
    .stApp > header {
        background-color: transparent;
    }
    
    .white-box {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        border: 1px solid rgba(255, 255, 255, 0.18);
        margin: 1rem 0;
    }
    
    .frosted-card {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        padding: 1.5rem;
        box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin: 1rem 0;
        color: white;
    }
    
    .title {
        color: white;
        text-align: center;
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 1rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .subtitle {
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
        font-size: 1.2rem;
        margin-bottom: 2rem;
    }
    
    .nav-button {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        color: white;
        padding: 1rem;
        margin: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }
    
    .nav-button:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
    }
    
    .result-box {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 1rem;
        margin: 1rem 0;
        color: white;
        border-left: 4px solid #4CAF50;
    }
    
    .input-section {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 1.5rem;
        margin: 1rem 0;
    }
    </style>
    """, unsafe_allow_html=True)

def container_wrapper(func):
    """Decorator to wrap page content in styled container."""
    def wrapper(*args, **kwargs):
        st.markdown('<div class="white-box">', unsafe_allow_html=True)
        result = func(*args, **kwargs)
        st.markdown('</div>', unsafe_allow_html=True)
        return result
    return wrapper

# API Configuration
BACKEND_URL = "http://127.0.0.1:8000"

# Initialize session state
if "page" not in st.session_state:
    st.session_state.page = "home"

def make_api_request(endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Make API request to backend."""
    try:
        response = requests.post(f"{BACKEND_URL}/api/v1/{endpoint}", json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.ConnectionError:
        return {"error": "Could not connect to backend service. Please ensure the FastAPI server is running on port 8000."}
    except Exception as e:
        return {"error": f"Request failed: {str(e)}"}

# Page Navigation
def show_home():
    """Display home page with navigation."""
    
    st.markdown('<h1 class="title">💰 Personal Finance Chatbot</h1>', unsafe_allow_html=True)
    st.markdown('<p class="subtitle">AI-powered financial guidance tailored just for you</p>', unsafe_allow_html=True)
    
    # Feature cards
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div class="frosted-card">
            <h3>🧠 NLU Analysis</h3>
            <p>Analyze the sentiment and key concepts in your financial questions using IBM Watson NLU.</p>
        </div>
        """, unsafe_allow_html=True)
        
        if st.button("Try NLU Analysis", key="nlu_btn"):
            st.session_state.page = "nlu"
            st.rerun()
    
    with col2:
        st.markdown("""
        <div class="frosted-card">
            <h3>💬 Q&A Assistant</h3>
            <p>Get personalized financial advice through natural conversation with our AI assistant.</p>
        </div>
        """, unsafe_allow_html=True)
        
        if st.button("Ask Questions", key="qa_btn"):
            st.session_state.page = "generate"
            st.rerun()
    
    col3, col4 = st.columns(2)
    
    with col3:
        st.markdown("""
        <div class="frosted-card">
            <h3>📊 Budget Summary</h3>
            <p>Get comprehensive analysis of your income, expenses, and savings with personalized recommendations.</p>
        </div>
        """, unsafe_allow_html=True)
        
        if st.button("Create Budget Summary", key="budget_btn"):
            st.session_state.page = "budget-summary"
            st.rerun()
    
    with col4:
        st.markdown("""
        <div class="frosted-card">
            <h3>🔍 Spending Insights</h3>
            <p>Deep dive into your spending patterns and get actionable insights for financial optimization.</p>
        </div>
        """, unsafe_allow_html=True)
        
        if st.button("Analyze Spending", key="spending_btn"):
            st.session_state.page = "spending-insights"
            st.rerun()

@container_wrapper
def show_nlu_page():
    """Display NLU analysis page."""
    
    if st.button("🔙 Back", key="nlu_back"):
        st.session_state.page = "home"
        st.rerun()
    
    st.title("🧠 Natural Language Understanding Analysis")
    st.write("Enter your financial question or concern to see how our AI understands it.")
    
    # Input section
    st.markdown('<div class="input-section">', unsafe_allow_html=True)
    sample_text = '{"text": "I need help with saving money each month while paying off my student loans"}'
    user_input = st.text_area("Enter JSON with your text:", value=sample_text, height=100)
    st.markdown('</div>', unsafe_allow_html=True)
    
    if st.button("Send", key="nlu_send"):
        try:
            data = json.loads(user_input)
            result = make_api_request("nlu", data)
            
            st.markdown("### Analysis Results:")
            if "error" in result:
                st.error(result["error"])
            else:
                st.json(result)
        
        except json.JSONDecodeError:
            st.error("Please enter valid JSON format")

@container_wrapper 
def show_generate_page():
    """Display Q&A generation page."""
    
    if st.button("🔙 Back", key="gen_back"):
        st.session_state.page = "home"
        st.rerun()
    
    st.title("💬 Personal Finance Q&A")
    st.write("Ask any financial question and get personalized advice based on your situation.")
    
    # Input section
    st.markdown('<div class="input-section">', unsafe_allow_html=True)
    sample_question = '{"question": "How can I save money while paying off student loans?", "persona": "student"}'
    user_input = st.text_area("Enter JSON with your question:", value=sample_question, height=100)
    st.markdown('</div>', unsafe_allow_html=True)
    
    if st.button("Send", key="gen_send"):
        try:
            data = json.loads(user_input)
            result = make_api_request("generate", data)
            
            st.markdown("### AI Response:")
            if "error" in result:
                st.error(result["error"])
            else:
                # Display the response in a formatted way
                if "response" in result:
                    st.markdown(result["response"])
                else:
                    st.json(result)
        
        except json.JSONDecodeError:
            st.error("Please enter valid JSON format")

@container_wrapper
def show_budget_summary_page():
    """Display budget summary page."""
    
    if st.button("🔙 Back", key="budget_back"):
        st.session_state.page = "home"
        st.rerun()
    
    st.title("📊 Budget Summary Generator")
    st.write("Provide your financial information to get a comprehensive budget analysis.")
    
    # Input section
    st.markdown('<div class="input-section">', unsafe_allow_html=True)
    sample_budget = '''{
    "income": 4000,
    "expenses": {
        "rent": 1200,
        "food": 400,
        "transportation": 300,
        "utilities": 150,
        "entertainment": 200,
        "shopping": 150
    },
    "savings_goal": 500,
    "currency": "$",
    "user_type": "professional"
}'''
    user_input = st.text_area("Enter JSON with your budget information:", value=sample_budget, height=200)
    st.markdown('</div>', unsafe_allow_html=True)
    
    if st.button("Send", key="budget_send"):
        try:
            data = json.loads(user_input)
            result = make_api_request("budget-summary", data)
            
            st.markdown("### Budget Analysis:")
            if "error" in result:
                st.error(result["error"])
            else:
                # Display the summary in a formatted way
                if "summary" in result and "response" in result["summary"]:
                    st.markdown(result["summary"]["response"])
                else:
                    st.json(result)
        
        except json.JSONDecodeError:
            st.error("Please enter valid JSON format")

@container_wrapper
def show_spending_insights_page():
    """Display spending insights page."""
    
    if st.button("🔙 Back", key="spending_back"):
        st.session_state.page = "home"
        st.rerun()
    
    st.title("🔍 Spending Insights & Analysis")
    st.write("Get detailed insights into your spending patterns and goal progress.")
    
    # Input section
    st.markdown('<div class="input-section">', unsafe_allow_html=True)
    sample_spending = '''{
    "income": 5000,
    "expenses": {
        "rent": 1500,
        "food": 600,
        "transportation": 400,
        "utilities": 200,
        "entertainment": 300,
        "shopping": 250,
        "insurance": 150
    },
    "goals": [
        {"name": "Emergency Fund", "amount": 10000, "months": 12},
        {"name": "Vacation", "amount": 3000, "months": 6}
    ],
    "user_type": "professional"
}'''
    user_input = st.text_area("Enter JSON with your spending data:", value=sample_spending, height=250)
    st.markdown('</div>', unsafe_allow_html=True)
    
    if st.button("Send", key="spending_send"):
        try:
            data = json.loads(user_input)
            result = make_api_request("spending-insights", data)
            
            st.markdown("### Spending Analysis:")
            if "error" in result:
                st.error(result["error"])
            else:
                # Display the insights in a formatted way
                if "insights" in result and "response" in result["insights"]:
                    st.markdown(result["insights"]["response"])
                else:
                    st.json(result)
        
        except json.JSONDecodeError:
            st.error("Please enter valid JSON format")

# Main app logic
def main():
    set_background()
    
    # Page routing
    if st.session_state.page == "home":
        show_home()
    elif st.session_state.page == "nlu":
        show_nlu_page()
    elif st.session_state.page == "generate":
        show_generate_page()
    elif st.session_state.page == "budget-summary":
        show_budget_summary_page()
    elif st.session_state.page == "spending-insights":
        show_spending_insights_page()

if __name__ == "__main__":
    main()