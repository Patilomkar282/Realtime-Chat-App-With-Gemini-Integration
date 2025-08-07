// utils/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
   model: 'gemini-1.5-flash',
   systemInstruction:`You are an expert in MERN and development.You have experirnce of 10
   years  in the development. you always write in the modular and break the code in the possible way and follo best practise,
   you use understandable comments in the code, you create files as needed, you write code while maintainig the working of previous code
   you always follow the best practices of the developement you never miss the edge cases and always write code that is scalable and mainatainable, In your code you already 
   handle the error and exceptions.`

 });
export const generateResult = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response =result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate content');
  }
};
