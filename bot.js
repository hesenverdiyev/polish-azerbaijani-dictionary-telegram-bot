import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import schedule from 'node-schedule';
import dotenv from "dotenv";

dotenv.config();

// Replace with your Telegram bot token
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Path to the file containing Polish words
const wordsFilePath = './uploads/polish_words.txt';

// Load Polish words from the file
let polishWords = [];
let currentIndex = 0;

fs.readFile(wordsFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading Polish words file:', err);
    return;
  }
  polishWords = data.split('\n').map(word => word.trim()).filter(word => word);
  
  // Send the first set of words immediately after loading the file
  sendWords();
});

// Function to get the next 5 Polish words sequentially
const getNextWords = (count = 5) => {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(polishWords[currentIndex]);
    currentIndex = (currentIndex + 1) % polishWords.length; // Increment and wrap around
  }
  return words;
};

// Replace with your channel or group ID
const chatId = process.env.TELEGRAM_CHANNEL_ID;

// Function to send 5 Polish words
const sendWords = () => {
  const words = getNextWords().map(word => `*${word}*`).join('\n'); // Make each word bold
  bot.sendMessage(chatId, `Bu günün sözləri:\n\n${words}`, { parse_mode: 'Markdown' });
};

// Schedule the job to send words every 8 hours
const job = schedule.scheduleJob('0 */8 * * *', sendWords);

console.log('Bot is running...');
