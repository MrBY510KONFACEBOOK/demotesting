const { OpenAIApi } = require('openai');
const fs = require('fs');

const openai = new OpenAIApi({ key: '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' }); // Replace with your OpenAI API key

const numQuestions = 100; // Number of quiz questions to generate

async function generateQuizQuestion(context) {
    const prompt = `Create a quiz question related to the following context:\n${context}\nQuestion:`;
    const response = await openai.complete({
        prompt,
        max_tokens: 50,
    });

    return response.choices[0].text.trim();
}

async function generateQuizQuestions() {
    const quizQuestions = [];

    for (let i = 0; i < numQuestions; i++) {
        const context = 'Provide context for the question here.';
        const question = await generateQuizQuestion(context);

        quizQuestions.push({
            question: question,
            answer: 'Provide the answer here.'
        });

        console.log(`Generated question ${i + 1}`);
    }

    // Write the generated quiz questions to a JSON file
    fs.writeFileSync('generated_quiz_questions.json', JSON.stringify(quizQuestions, null, 2));
    console.log(`Generated ${numQuestions} quiz questions and saved to generated_quiz_questions.json`);
}

generateQuizQuestions();
