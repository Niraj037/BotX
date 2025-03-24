#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import shell from "shelljs";
import figlet from "figlet";
import gradient from "gradient-string";
import ora from "ora";

const facts = [
  "Did you know? JavaScript was created in just 10 days!",
  "Fun fact: Discord.js makes bot creation super easy!",
  "Pro tip: Use .env to keep your bot token safe!",
  "Random thought: Coffee is just a bug fix for humans.",
];

const showTitle = () => {
  console.clear();
  console.log(gradient.pastel(figlet.textSync("Bot X")));
  console.log(chalk.cyan("\n🚀 Automate your Discord bot setup in seconds!\n"));
};

const setupBot = async () => {
  showTitle();

  const { projectName } = await inquirer.prompt([
    { type: "input", name: "projectName", message: "Enter project name:" }
  ]);

  shell.mkdir(projectName);
  shell.cd(projectName);
  console.log(chalk.green(`📁 Created project folder: ${projectName}`));

  shell.exec("npm init -y", { silent: true });
  console.log(chalk.blue("✅ Initialized Node.js project"));

  console.log(chalk.yellow("📦 Installing core dependencies..."));
  const spinner = ora("Installing discord.js, dotenv, and node-fetch...").start();
  shell.exec("npm install discord.js dotenv node-fetch", { silent: true });
  spinner.succeed("✅ Installed core dependencies!");

  const { botType } = await inquirer.prompt([
    {
      type: "list",
      name: "botType",
      message: "Select bot type:",
      choices: ["Music Bot", "Utility Bot", "Mod Bot"]
    }
  ]);

  let dependencies = [];
  if (botType === "Music Bot") {
    dependencies.push("@discordjs/voice", "@discordjs/lavalink", "ffmpeg-static", "axios");
  } else if (botType === "Utility Bot") {
    dependencies.push("mongoose", "sqlite3", "mysql", "axios", "moment");
  } else if (botType === "Mod Bot") {
    dependencies.push("mongoose", "axios");
  }

  spinner.start(`Installing dependencies for ${botType}...`);
  shell.exec(`npm install ${dependencies.join(" ")}`, { silent: true });
  spinner.succeed(`✅ Installed ${botType} dependencies!`);

  // Show a random fact
  console.log(chalk.magenta(`💡 ${facts[Math.floor(Math.random() * facts.length)]}`));

  const { installExtras } = await inquirer.prompt([
    { type: "confirm", name: "installExtras", message: "Install optional packages? (nodemon, chalk, fs-extra)" }
  ]);

  if (installExtras) {
    spinner.start("Installing optional packages...");
    shell.exec("npm install nodemon chalk fs-extra", { silent: true });
    spinner.succeed("✅ Installed optional packages!");
  }

  shell.mkdir("commands");
  shell.ShellString(
    `require('dotenv').config();\nconst { Client, GatewayIntentBits } = require('discord.js');\n\nconst client = new Client({ intents: [GatewayIntentBits.Guilds] });\n\nclient.once('ready', () => {\n  console.log('Bot is online!');\n});\n\nclient.login(process.env.TOKEN);`
  ).to("index.js");

  shell.ShellString("TOKEN=your-bot-token-here").to(".env");

  console.log(chalk.green("✅ Project setup complete!"));

 
  console.log(chalk.cyan("\n✨ Thank you for using Bot Kit CLI! ✨"));
  console.log(chalk.gray("Created by Niraj Bhakta"));

  shell.exec("code .", { silent: true });
};

setupBot();
