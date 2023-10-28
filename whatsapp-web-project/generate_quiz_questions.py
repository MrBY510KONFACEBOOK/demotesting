import openai
import json

# Set your OpenAI API key
openai.api_key = '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'

num_questions = 100  # Number of quiz questions to generate
context = "Provide context for the question here."

quiz_questions = []

for _ in range(num_questions):
    prompt = f"Create a quiz question related to the following context:\n{context}\nQuestion:"
    response = openai.Completion.create(
        engine="davinci",  # You can experiment with other engines like "text-davinci-003"
        prompt=prompt,
        max_tokens=500,
        n=1,
        stop=None
    )
    question = response.choices[0].text.strip()
    
    quiz_questions.append({
        "question": question,
        "answer": "Provide the answer here."
    })
    
    print(f"Generated question: {question}")

# Save the generated quiz questions to a JSON file
with open('generated_quiz_questions.json', 'w') as json_file:
    json.dump(quiz_questions, json_file, indent=2)

print(f"Generated {num_questions} quiz questions and saved to generated_quiz_questions.json")
