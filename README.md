# Personal Finance Chatbot

An AI-powered personal finance assistant that provides personalized financial guidance using advanced natural language processing capabilities.

## Features

- **Natural Language Understanding**: Analyzes user queries for sentiment, keywords, and financial concepts
- **Persona-Based Responses**: Tailored advice for students vs professionals
- **Budget Summary Generation**: Comprehensive analysis of income, expenses, and savings
- **Spending Insights**: Deep behavioral analysis with actionable recommendations
- **Interactive Q&A**: Conversational AI for financial guidance
- **Modern UI**: Frosted glass design with smooth animations

## Technology Stack

- **Backend**: FastAPI with Python 3.8+
- **Frontend**: Streamlit with custom CSS
- **AI Integration**: Mock implementations of IBM Watson NLU and Watsonx Granite models
- **Data Validation**: Pydantic models
- **Environment Management**: python-dotenv

## Installation

1. **Clone and setup the project:**
   ```bash
   cd /path/to/project
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   Edit `.env` file with your IBM Cloud credentials:
   ```
   NLU_KEY=your_watson_nlu_key_here
   NLU_URL=https://api.us-south.natural-language-understanding.watson.cloud.ibm.com
   WATSONX_KEY=your_watsonx_key_here
   WATSONX_URL=https://us-south.ml.cloud.ibm.com
   WATSONX_MODEL_ID=ibm/granite-3-2-8b-instruct
   PROJECT_ID=your_project_id_here
   ```

## Running the Application

1. **Start the FastAPI backend:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Start the Streamlit frontend:**
   ```bash
   streamlit run streamlit_app.py
   ```

3. **Access the application:**
   - Frontend: http://localhost:8501
   - API Documentation: http://localhost:8000/docs

## API Endpoints

- `POST /api/v1/nlu` - Natural Language Understanding analysis
- `POST /api/v1/generate` - Generate personalized financial advice
- `POST /api/v1/budget-summary` - Create comprehensive budget summaries
- `POST /api/v1/spending-insights` - Analyze spending patterns and goals
- `GET /api/v1/health` - Health check endpoint

## Usage Examples

### Budget Summary
```json
{
    "income": 4000,
    "expenses": {
        "rent": 1200,
        "food": 400,
        "transportation": 300
    },
    "savings_goal": 500,
    "currency": "$",
    "user_type": "professional"
}
```

### Spending Insights
```json
{
    "income": 5000,
    "expenses": {
        "rent": 1500,
        "food": 600
    },
    "goals": [
        {"name": "Emergency Fund", "amount": 10000, "months": 12}
    ],
    "user_type": "professional"
}
```

## Architecture

```
├── app/
│   ├── ibm_api.py      # Mock IBM Watson and Watsonx integration
│   ├── routes.py       # FastAPI routes and request handling
│   └── utils.py        # Prompt building and utility functions
├── main.py             # FastAPI application setup
├── streamlit_app.py    # Streamlit frontend
├── requirements.txt    # Python dependencies
├── .env               # Environment variables
└── README.md          # Documentation
```

## Note on IBM Integration

This implementation includes mock versions of IBM Watson NLU and Watsonx services for demonstration purposes. In a production environment, replace the mock functions in `app/ibm_api.py` with actual IBM SDK calls using your authenticated credentials.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational and demonstration purposes.