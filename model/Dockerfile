FROM python:3.9

# Install dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the src
COPY . .

# Run the app
CMD ["python", "src/app.py"]
