'use strict';

const Alexa = require('alexa-sdk');
const questions = require('./questions');
const makePlainText = Alexa.utils.TextUtils.makePlainText;
const makeRichText = Alexa.utils.TextUtils.makeRichText;
const ANSWER_COUNT = 4; // The number of possible answers per trivia question.
const GAME_LENGTH = 5;  // The number of questions per trivia game.
const GAME_STATES = {
    TRIVIA: "_TRIVIAMODE", // Asking trivia questions.
    START: "_STARTMODE", // Entry point, start the game.
    HELP: "_HELPMODE", // The user is asking for help.
};

//=========================================================================================================================================
//High level skill constants
//=========================================================================================================================================

const APP_ID = 'amzn1.ask.skill.6d5effc0-d416-47c5-8d9a-52fb0654f771';

const SKILL_NAME = 'About Guru';
const HELP_MESSAGE = 'You can ask guru about what he does, what he likes, his technical skills, his work experiences etc.. or play, How well do you know Guru? a small trivia about guru and see how well you score.';
const HELP_REPROMPT = 'What do you want to know about guru?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//Speech output constants about guru
//=========================================================================================================================================

const guru_work = "Guru works as an Full Stack Developer at Nationwide. Say work experience to know more about guru's work history";
const guru_fullName = "His full name is Srisarguru Sridhar. He goes by either guru or batman";
const guru_launch = "Welcome to About Guru. This skill is to know about guru. If you don't know him well you can get to know him through this skill. You can ask him about his likes, his technical skills, his work experiennces and you can also play a trivia game How well do you know guru. What do you like to know about him ?";
const guru_launch_reprompt = "What do you like to know about him ?";
const guru_color = "His favourite colors are red and black. Although he always told me he wanted rainbow dyed hair";
const guru_summary = "Guru is a Full Stack developer with a passion for technology, development and innovation. He strongly believes that learning is a continuous process and that the best way to gain knowledge, is not only by learning but also by sharing. He enjoys working on both backend as well as frontend, with a constant lookout to learn new technologies currently used in the industry. His career path has helped him to develop strong problem-solving, communication, mentoring and leadership skills, along with the ability to work both as a team player as well as a solo performer when needed.";
const guru_techskills = "Full Stack Development and proficient in a number of programming languages and scripting languages, databases, web services, tools and frameworks. I have sent all the details of his technical skills to your device";
const guru_favActor = "His favourite actors are Hugh Jackman, Rajnikanth and Emma Watson";
const guru_relationship = "He is single and No!, we are not in a relationship";
const guru_favMovie = "His all time favourite movie is The Prestige directed by Christopher Nolan";
const guru_nationality = "He is Indian. But he resides now in the US";
const guru_contact = "You can ask him more by sending an email to him. I have sent his email address to your device";
const guru_favAthlethe = "His most favourite is M.S. Dhoni";
const guru_favSports = "He likes to watch Cricket, American Football and Hockey";
const guru_favTeam = "His favourite club cricket team is Chennai Super Kings, his favorite college football team is Boise State Broncos, his favorite NHL team is Columbus Blue Jackets and his favorite NFL team is Dallas Cowboys";
const guru_favFood = "He likes to eat everything except humans";
const guru_education = "He has a Master's degree in Computer Science";
const guru_favQuote = "It will be Alright in the end. If it is not Alright, it is not the end";
const guru_favMusicBand = "He likes Ed Sheeran, Bruno Mars, A.R.Rahman and Frank Sinatra";
const guru_favCar = "He always wanted a Ford Mustang";
const guru_favSuperhero = "His favorite superhero is The Wolverine";
const guru_languages = "He knows Tha mil and English. His native language is Tha mil";
const guru_favPlace = "His most favorite place is Boise, Idaho";
const guru_favLeader = "He regards A.P.J Abdul Kalam as his inspiration.";
const guru_favSongs = "His favorites are Strangers in the night by Frank Sinatra, Heroes by David Bowie, Hurt by Johnny Cash and Antha Arabi Kadalorum by A.R. Rahman";
const guru_favSeason = "He prefers Spring.";
const guru_favTvSeries = "It is none other than Breaking Bad.";
const guru_favVideoGame = "Horizon Zero Dawn blew him away. Aloy All the way";
const guru_workExpereince = "He has around 3 plus years’ experience in development, research and teaching. I have sent a brief list of his work history to your device."

//TODO COVERLETTER add project details as a speech and card 
//========================================================================================
// Card constants
//========================================================================================

const guru_email = "s.srisarguru@gmail.com";
const guru_contactCardTitle = "Guru's Email Id";
const guru_techskills_card_title = "Guru's Technical Skills";
const guru_techskills_card_content = "Programming Proficiency: \n " +
    "Java, C, C++, Android Java, SQL.\n\n" +
    "Java/J2EE Frameworks: \n" +
    "Core Java, Servlets, Spring, Struts, Hibernate, JSP, iBatis \n\n" +
    "Language/Scripting: \n" +
    "JavaScript, Angular JS, Node JS, JQuery, HTML5, CSS, Shell scripting \n\n" +
    "Web Services: \n" +
    "SOAP, Restful, Apigee \n\n" +
    "Servers: \n" +
    "Apache Tomcat, JBoss, Webshpere. \n\n" +
    "RDBMS: \n" +
    "Oracle, MySQL and NoSQL. \n\n" +
    "IDE / Tools: \n" +
    "Eclipse, RAD, Spring STS, Net Beans and TOAD. \n\n" +
    "Build & Project Tracking Tools: \n" +
    "Jenkins, Maven, Ant, Bugzilla, Redmine, HP Quality Center, UCD. \n\n" +
    "Operating Systems: \n" +
    "Unix/Linux, Mac OS X, Windows. \n\n" +
    "Version Control: \n" +
    "Git, Fossil, SVN. \n\n" +
    "Others: \n" +
    "Matlab, Cyber-Security, Latex, Python, PHP, Bootstrap";
const guru_work_title = "Guru's Work Experience";
const guru_work_content = "Nationwide Insurance, Columbus OH, Full Stack Developer (Java/J2EE) from August 2017 – Present \n" +
    "Columbus International Corporation, OH, Software Engineer (Java/J2EE) from April 2017 – August 2017 \n" +
    "Researcher and Developer, RA at CS Department at Boise State University from January 2015 – December 2016 \n" +
    "Teaching Assistant, CS Department at Boise State University from January 2015 – December 2016 \n" +
    "HPC Administration, Boise State University OIT from June 2015 – August 2015 \n" +
    "Part-time Developer at ByteBe® Solutions India Private Limited from July 2013 – May 2014 \n" +
    "Java Developer Internship at ABT Info Systems from Dec 2012 – May 2013"

//=======================================================================================
// Display Template constants
//=======================================================================================
const guru_ts_title1 = "<font size=\"6\"> Programming Proficiency:</font>"
const guru_ts_content1 = "<font size=\"3\">Java, C, C++, Android Java, SQL.</font>"
const guru_ts_title2 = " <font size=\"6\">Java/J2EE Frameworks:</font>"
const guru_ts_content2 = "<font size=\"3\">Core Java, Servlets, Spring, Struts, Hibernate, JSP, iBatis</font>"
const guru_ts_title3 = " <font size=\"6\">Language/Scripting:</font>"
const guru_ts_content3 = "<font size=\"1\">JavaScript, Angular JS, Node JS, JQuery, HTML5, CSS, Shell scripting</font>"
const guru_ts_title4 = " <font size=\"6\">Web Services:</font>"
const guru_ts_content4 = "<font size=\"3\">SOAP, Restful, Apigee </font>"
const guru_ts_title5 = " <font size=\"6\">Servers:</font>"
const guru_ts_content5 = "<font size=\"3\">Apache Tomcat, JBoss, Webshpere.</font>"
const guru_ts_title6 = " <font size=\"6\">RDBMS:</font>"
const guru_ts_content6 = "<font size=\"3\">Oracle, MySQL and NoSQL.</font>"
const guru_ts_title7 = " <font size=\"6\">IDE / Tools:</font>"
const guru_ts_content7 = "<font size=\"3\">Eclipse, RAD, Spring STS, Net Beans and TOAD.</font>"
const guru_ts_title8 = " <font size=\"6\">Build &amp; Project Tracking Tools: </font>"
const guru_ts_content8 = "<font size=\"2\">Jenkins, Maven, Ant, Bugzilla, Redmine, HP QC, UCD.</font>"
const guru_ts_title9 = " <font size=\"6\">Operating Systems:</font>"
const guru_ts_content9 = "<font size=\"3\">Unix/Linux, Mac OS X, Windows.</font>"
const guru_ts_title10 = " <font size=\"6\">Version Control:</font>"
const guru_ts_content10 = "<font size=\"3\">Git, Fossil, SVN.</font>"
const guru_ts_title11 = " <font size=\"6\">Others:</font>"
const guru_ts_content11 = "<font size=\"3\">Matlab, Cyber-Security, Latex, Python, PHP, Bootstrap</font>";

//==========================================================================================
//FOR GURU TRIVIA
//===========================================================================================
const languageString = {
    "en": {
        "translation": {
            "QUESTIONS": questions["QUESTIONS"],
            "GAME_NAME": "How well do you know Guru",
            "HELP_MESSAGE": "I will ask you %s multiple choice questions. Respond with the number of the answer. " +
            "For example, say one, two, three, or four. To start a new game at any time, say, start game. ",
            "REPEAT_QUESTION_MESSAGE": "To repeat the last question, say, repeat. ",
            "ASK_MESSAGE_START": "Would you like to start playing?",
            "HELP_REPROMPT": "To give an answer to a question, respond with the number of the answer. ",
            "STOP_MESSAGE": "Would you like to keep playing?",
            "CANCEL_MESSAGE": "Ok, let\'s play again soon.",
            "NO_MESSAGE": "Ok, we\'ll play another time. Goodbye!",
            "TRIVIA_UNHANDLED": "Try saying a number between 1 and %s",
            "HELP_UNHANDLED": "Say yes to continue, or no to end the game.",
            "START_UNHANDLED": "Say start to start a new game.",
            "NEW_GAME_MESSAGE": "Welcome to %s. ",
            "WELCOME_MESSAGE": "I will ask you %s questions, try to get as many right as you can. " +
            "Just say the number of the answer. Let\'s begin. ",
            "ANSWER_CORRECT_MESSAGE": "correct. ",
            "ANSWER_WRONG_MESSAGE": "wrong. ",
            "CORRECT_ANSWER_MESSAGE": "The correct answer is %s: %s. ",
            "ANSWER_IS_MESSAGE": "That answer is ",
            "TELL_QUESTION_MESSAGE": "Question %s. %s ",
            "GAME_OVER_MESSAGE": "You got %s out of %s questions correct. Thank you for playing!",
            "SCORE_IS_MESSAGE": "Your score is %s. ",
            "MOVE_ON_TO_NEXT_QUESTION": "Bummer, Let's move on to the next question",
        },
    }
}
//=========================================================================================================================================
//Handlers
//=========================================================================================================================================

const initialhandlers = {
    'LaunchRequest': function () {
        this.emit('LaunchGuruIntent');
    },
    'LaunchGuruIntent': function () {
        const speechOutput = guru_launch;
        const repromptSpeech = guru_launch_reprompt;
        this.emit(':ask', speechOutput, repromptSpeech);
        this.emit(':responseReady');
    },
    'WorkIntent': function () {
        const speechOutput = guru_work;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'RealNameIntent': function () {
        const speechOutput = guru_fullName;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'FavoriteIntent': function () {
        const intentObj = this.event.request.intent;
        const favAbout = intentObj.slots.favAbout.value;
        switch (favAbout) {
            case 'colors':
            case 'color': {
                this.emit('ColorIntent');
                break;
            }
            case 'cars':
            case 'car': {
                this.emit('CarIntent');
                break;
            }
            case 'actor':
            case 'actors': {
                this.emit('ActorIntent');
                break;
            }
            case 'movie':
            case 'movies':
            case 'picture': {
                this.emit('MovieIntent');
                break;
            }
            case 'sport':
            case 'sports': {
                this.emit('SportsIntent');
                break;
            }
            case 'sportsperson':
            case 'sportspersons':
            case 'athletes':
            case 'athlete': {
                this.emit('SportspersonIntent');
                break;
            }
            case 'music':
            case 'music band':
            case 'band':
            case 'singer':
            case 'musician': {
                this.emit('MusicIntent');
                break;
            }
            case 'food':
            case 'food to eat':
            case 'to eat':
            case 'dish': {
                this.emit('FoodIntent');
                break;
            }
            case 'saying':
            case 'quote':
            case 'quotes': {
                this.emit('FavQuoteIntent');
                break;
            }
            case 'superhero':
            case 'superheroes':
            case 'comic superhero':
            case 'comic character':
            case 'comic superhero':
            case 'comic hero': {
                this.emit('FavSuperheroIntent');
                break;
            }
            case 'place':
            case 'city':
            case 'place to visit':
            case 'land':
            case 'place to live':
            case 'place on earth': {
                this.emit('FavPlaceIntent');
                break;
            }
            case 'leader':
            case 'inspirational leader':
            case 'look up to':
            case 'inspiration': {
                this.emit('FavLeaderIntent');
                break;
            }
            case 'season': {
                this.emit('FavSeasonIntent');
                break;
            }
            case 'TV show':
            case 'TV series':
            case 'TV series to watch':
            case 'TV show to watch': {
                this.emit('FavSeriesIntent');
                break;
            }
            case 'video game':
            case 'computer game':
            case 'console game':
            case 'ps4 game':
            case 'playstation game': {
                this.emit('FavVideoGameIntent');
                break;
            }
            case 'cricket team':
            case 'football team':
            case 'sports team':
            case 'NFL team':
            case 'college football team':
            case 'IPL team':
            case 'league team':
            case 'NHL team':
            case 'hockey team': {
                this.emit('FavSportsTeamIntent');
                break;
            }
            case 'song':
            case 'songs': {
                this.emit('FavSongIntent');
                break;
            }
            default:
                this.emit('AMAZON.HelpIntent');
        }
    },
    'ColorIntent': function () {
        const speechOutput = guru_color;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'SummaryIntent': function () {
        const speechOutput = guru_summary;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'ActorIntent': function () {
        const speechOutput = guru_favActor;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'RelationshipIntent': function () {
        const speechOutput = guru_relationship;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'MovieIntent': function () {
        const speechOutput = guru_favMovie;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'NationalityIntent': function () {
        const speechOutput = guru_nationality;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'CarIntent': function () {
        const speechOutput = guru_favCar;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'DegreeIntent': function () {
        const speechOutput = guru_education;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'SportsIntent': function () {
        const speechOutput = guru_favSports;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'SportspersonIntent': function () {
        const speechOutput = guru_favAthlethe;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'FoodIntent': function () {
        const speechOutput = guru_favFood;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'MusicIntent': function () {
        const speechOutput = guru_favMusicBand;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'FavQuoteIntent': function () {
        const speechOutput = guru_favQuote;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'FavSuperheroIntent': function () {
        const speechOutput = guru_favSuperhero;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'LanguageIntent': function () {
        const speechOutput = guru_languages;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'FavPlaceIntent': function () {
        const speechOutput = guru_favPlace;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'FavLeaderIntent': function () {
        const speechOutput = guru_favLeader;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'FavSeasonIntent': function () {
        const speechOutput = guru_favSeason;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'FavSeriesIntent': function () {
        const speechOutput = guru_favTvSeries;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'FavVideoGameIntent': function () {
        const speechOutput = guru_favVideoGame;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'FavSportsTeamIntent': function () {
        const speechOutput = guru_favTeam;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'FavSongIntent': function() {
        const speechOutput = guru_favSongs;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'ContactIntent': function () {
        const speechOutput = guru_contact;
        this.emit(':tellWithCard', speechOutput, guru_contactCardTitle, guru_email);
    },
    'TechnicalSkillsIntent': function() {
       this.response.speak(guru_techskills).cardRenderer(guru_techskills_card_title, guru_techskills_card_content);
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const listItemBuilder = new Alexa.templateBuilders.ListItemBuilder();
            const listTemplateBuilder = new Alexa.templateBuilders.ListTemplate1Builder();
            listItemBuilder.addItem(null,'listItemToken1', makeRichText(guru_ts_title1), makeRichText(guru_ts_content1));
            //listItemBuilder.addItem(null,'listItemToken1', makeRichText(guru_ts_title1 + guru_ts_content1));
            listItemBuilder.addItem(null,'listItemToken2', makeRichText(guru_ts_title2), makeRichText(guru_ts_content2));
            listItemBuilder.addItem(null,'listItemToken3', makeRichText(guru_ts_title3), makeRichText(guru_ts_content3));
            listItemBuilder.addItem(null,'listItemToken4', makeRichText(guru_ts_title4), makeRichText(guru_ts_content4));
            listItemBuilder.addItem(null,'listItemToken5', makeRichText(guru_ts_title5), makeRichText(guru_ts_content5));
            listItemBuilder.addItem(null,'listItemToken6', makeRichText(guru_ts_title6), makeRichText(guru_ts_content6));
            listItemBuilder.addItem(null,'listItemToken7', makeRichText(guru_ts_title7), makeRichText(guru_ts_content7));
            listItemBuilder.addItem(null,'listItemToken8', makeRichText(guru_ts_title8), makeRichText(guru_ts_content8));
            listItemBuilder.addItem(null,'listItemToken9', makeRichText(guru_ts_title9), makeRichText(guru_ts_content9));
            listItemBuilder.addItem(null,'listItemToken10', makeRichText(guru_ts_title10), makeRichText(guru_ts_content10));
            listItemBuilder.addItem(null,'listItemToken11', makeRichText(guru_ts_title11), makeRichText(guru_ts_content11));
            
            const listItems = listItemBuilder.build();
            const listTemplate = listTemplateBuilder.setToken('listToken')
                .setTitle(guru_techskills_card_title)
                .setListItems(listItems)
                .build();
            this.response.renderTemplate(listTemplate);
        }
        this.emit(':responseReady');
    },
    'WorkExperienceIntent': function () {
        const speechOutput = guru_workExpereince;
        this.emit(':tellWithCard', speechOutput, guru_work_title, guru_work_content);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    "GuruTriviaIntent": function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", true);
    },
    "AMAZON.StartOverIntent": function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", true);
    },

};

//Handler to handle the start of the trivia game
const startStateHandlers = Alexa.CreateStateHandler(GAME_STATES.START, {
    "StartGame": function (newGame) {
        let speechOutput = newGame ? this.t("NEW_GAME_MESSAGE", this.t("GAME_NAME")) + this.t("WELCOME_MESSAGE", GAME_LENGTH.toString()) : "";

        const translatedQuestions = this.t("QUESTIONS");
        // Select GAME_LENGTH questions for the game
        const gameQuestions = populateGameQuestions(translatedQuestions);

        // Generate a random index for the correct answer, from 0 to 3
        const correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
        // Select and shuffle the answers for each question
        const roundAnswers = populateRoundAnswers(gameQuestions, 0, correctAnswerIndex, translatedQuestions);
        const currentQuestionIndex = 0;
        const spokenQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0];
        // Build reprompt for the question
        let repromptText = this.t("TELL_QUESTION_MESSAGE", "1", spokenQuestion);

        for (let i = 0; i < ANSWER_COUNT; i++) {
            repromptText += `${i + 1}. ${roundAnswers[i]}. `;
        }

        //Build object for session
        speechOutput += repromptText;

        Object.assign(this.attributes, {
            "speechOutput": repromptText,
            "repromptText": repromptText,
            "currentQuestionIndex": currentQuestionIndex,
            "correctAnswerIndex": correctAnswerIndex + 1,
            "questions": gameQuestions,
            "score": 0,
            "correctAnswerText": translatedQuestions[gameQuestions[currentQuestionIndex]][Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0]][0],
        });

        //Handle trivia state. Set the current state to trivia mode. The skill will now use handlers defined in triviaStateHandlers
        this.handler.state = GAME_STATES.TRIVIA;

        //build and send the response as listen
        this.response.speak(speechOutput).listen(repromptText);
        this.response.cardRenderer(this.t("GAME_NAME"), repromptText);
        this.emit(":responseReady");

    },
});

//Handler to handle in trivia mode ie during the game after the start handler
const triviaStateHandlers = Alexa.CreateStateHandler(GAME_STATES.TRIVIA, {
    "AnswerIntent": function () { //if the user answers a question
        handleUserGuess.call(this, false);
    },
    "DontKnowIntent": function () { //if user says he doesn't know
        handleUserGuess.call(this, true);
    },
    "AMAZON.StartOverIntent": function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", false);
    },
    "AMAZON.RepeatIntent": function () {
        this.response.speak(this.attributes["speechOutput"]).listen(this.attributes["repromptText"]);
        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function () {
        this.handler.state = GAME_STATES.HELP;
        this.emitWithState("helpTheUser", false);
    },
    "AMAZON.StopIntent": function () {
        this.handler.state = GAME_STATES.HELP;
        const speechOutput = this.t("STOP_MESSAGE");
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function () {
        this.response.speak(this.t("CANCEL_MESSAGE"));
        this.emit(":responseReady");
    },
    "Unhandled": function () {
        const speechOutput = this.t("TRIVIA_UNHANDLED", ANSWER_COUNT.toString());
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    },
    "SessionEndedRequest": function () {
        console.log(`Session ended in trivia state: ${this.event.request.reason}`);
    },
});

// help handler to help handle in middle of the game like start over repeat etc.
const helpStateHandlers = Alexa.CreateStateHandler(GAME_STATES.HELP, {
    "helpTheUser": function (newGame) {
        const askMessage = newGame ? this.t("ASK_MESSAGE_START") : this.t("REPEAT_QUESTION_MESSAGE") + this.t("STOP_MESSAGE");
        const speechOutput = this.t("HELP_MESSAGE", GAME_LENGTH) + askMessage;
        const repromptText = this.t("HELP_REPROMPT") + askMessage;

        this.response.speak(speechOutput).listen(repromptText);
        this.emit(":responseReady");
    },
    "AMAZON.StartOverIntent": function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", false);
    },
    "AMAZON.RepeatIntent": function () {
        const newGame = !(this.attributes["speechOutput"] && this.attributes["repromptText"]);
        this.emitWithState("helpTheUser", newGame);
    },
    "AMAZON.HelpIntent": function () {
        const newGame = !(this.attributes["speechOutput"] && this.attributes["repromptText"]);
        this.emitWithState("helpTheUser", newGame);
    },
    "AMAZON.YesIntent": function () {
        if (this.attributes["speechOutput"] && this.attributes["repromptText"]) {
            this.handler.state = GAME_STATES.TRIVIA;
            this.emitWithState("AMAZON.RepeatIntent");
        } else {
            this.handler.state = GAME_STATES.START;
            this.emitWithState("StartGame", false);
        }
    },
    "AMAZON.NoIntent": function () {
        const speechOutput = this.t("NO_MESSAGE");
        this.response.speak(speechOutput);
        this.emit(":responseReady");
    },
    "AMAZON.StopIntent": function () {
        const speechOutput = this.t("STOP_MESSAGE");
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function () {
        this.response.speak(this.t("CANCEL_MESSAGE"));
        this.emit(":responseReady");
    },
    "Unhandled": function () {
        const speechOutput = this.t("HELP_UNHANDLED");
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    },
    "SessionEndedRequest": function () {
        console.log(`Session ended in help state: ${this.event.request.reason}`);
    },
});

//=========================================================================================================================================
//Guru Trivia Game
//=========================================================================================================================================

//pick random game length questions for the trivia game
function populateGameQuestions(translatedQuestions) {
    const gameQuestions = [];
    const indexList = [];
    let index = translatedQuestions.length;

    if (GAME_LENGTH > index) { // handle boundary conditions
        throw new Error("Invalid Game Length.");
    }

    for (let i = 0; i < translatedQuestions.length; i++) {
        indexList.push(i);
    }

    // Pick GAME_LENGTH random questions from the list to ask the user, make sure there are no repeats.
    for (let j = 0; j < GAME_LENGTH; j++) {
        const rand = Math.floor(Math.random() * index);
        index -= 1;

        const temp = indexList[index];
        indexList[index] = indexList[rand];
        indexList[rand] = temp;
        gameQuestions.push(indexList[index]);
    }

    return gameQuestions;
}

/**
 * Get the answers for a given question, and place the correct answer at the spot marked by the
 * correctAnswerTargetLocation variable. Note that you can have as many answers as you want but
 * only ANSWER_COUNT will be selected.
 * */
function populateRoundAnswers(gameQuestionIndexes, correctQuestionIndex, correctAnswerTargetLocation, translatedQuestions) {
    const answers = [];
    const answersCopy = translatedQuestions[gameQuestionIndexes[correctQuestionIndex]][Object.keys(translatedQuestions[gameQuestionIndexes[correctQuestionIndex]])[0]].slice();
    let index = answersCopy.length;

    if (index < ANSWER_COUNT) {
        throw new Error("Not enough answers for question.");
    }

    // Shuffle the answers, excluding the first element which is the correct answer.
    for (let j = 1; j < answersCopy.length; j++) {
        const rand = Math.floor(Math.random() * (index - 1)) + 1;
        index -= 1;

        const swapTemp1 = answersCopy[index];
        answersCopy[index] = answersCopy[rand];
        answersCopy[rand] = swapTemp1;
    }

    // Swap the correct answer into the target location
    for (let i = 0; i < ANSWER_COUNT; i++) {
        answers[i] = answersCopy[i];
    }
    const swapTemp2 = answers[0];
    answers[0] = answers[correctAnswerTargetLocation];
    answers[correctAnswerTargetLocation] = swapTemp2;
    return answers;
}

//This is to handle the answer the user responded for a question
function handleUserGuess(userGaveUp) {
    const answerSlotValid = isAnswerSlotValid(this.event.request.intent); // to validate the answer
    let speechOutput = "";
    let speechOutputAnalysis = "";
    const gameQuestions = this.attributes.questions;
    let correctAnswerIndex = parseInt(this.attributes.correctAnswerIndex, 10);
    let currentScore = parseInt(this.attributes.score, 10);
    let currentQuestionIndex = parseInt(this.attributes.currentQuestionIndex, 10);
    // const correctAnswerText = this.attributes.correctAnswerText;
    const translatedQuestions = this.t("QUESTIONS");

    if (answerSlotValid && parseInt(this.event.request.intent.slots.Answer.value, 10) === this.attributes["correctAnswerIndex"]) {
        currentScore++;
        speechOutputAnalysis = this.t("ANSWER_CORRECT_MESSAGE");
    } else {
        if (!userGaveUp) {
            speechOutputAnalysis = this.t("ANSWER_WRONG_MESSAGE");
        }

        //speechOutputAnalysis += this.t("CORRECT_ANSWER_MESSAGE", correctAnswerIndex, correctAnswerText);
    }

    // Check if we can exit the game session after GAME_LENGTH questions (zero-indexed)
    if (this.attributes["currentQuestionIndex"] === GAME_LENGTH - 1) {
        speechOutput = userGaveUp ? this.t("MOVE_ON_TO_NEXT_QUESTION") : "";
        speechOutput += speechOutputAnalysis + this.t("GAME_OVER_MESSAGE", currentScore.toString(), GAME_LENGTH.toString());

        this.response.speak(speechOutput);
        this.emit(":responseReady");
    } else {
        currentQuestionIndex += 1;
        correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
        const spokenQuestion = Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0];
        const roundAnswers = populateRoundAnswers.call(this, gameQuestions, currentQuestionIndex, correctAnswerIndex, translatedQuestions);
        const questionIndexForSpeech = currentQuestionIndex + 1;
        let repromptText = this.t("TELL_QUESTION_MESSAGE", questionIndexForSpeech.toString(), spokenQuestion);

        for (let i = 0; i < ANSWER_COUNT; i++) {
            repromptText += `${i + 1}. ${roundAnswers[i]}. `;
        }

        speechOutput = userGaveUp ? this.t("MOVE_ON_TO_NEXT_QUESTION") : "";
        speechOutput += speechOutputAnalysis + this.t("SCORE_IS_MESSAGE", currentScore.toString()) + repromptText;

        Object.assign(this.attributes, {
            "speechOutput": repromptText,
            "repromptText": repromptText,
            "currentQuestionIndex": currentQuestionIndex,
            "correctAnswerIndex": correctAnswerIndex + 1,
            "questions": gameQuestions,
            "score": currentScore,
            "correctAnswerText": translatedQuestions[gameQuestions[currentQuestionIndex]][Object.keys(translatedQuestions[gameQuestions[currentQuestionIndex]])[0]][0],
        });

        this.response.speak(speechOutput).listen(repromptText);
        this.response.cardRenderer(this.t("GAME_NAME"), repromptText);
        this.emit(":responseReady");
    }
}

function isAnswerSlotValid(intent) {
    const answerSlotFilled = intent && intent.slots && intent.slots.Answer && intent.slots.Answer.value;
    const answerSlotIsInt = answerSlotFilled && !isNaN(parseInt(intent.slots.Answer.value, 10));
    return answerSlotIsInt
        && parseInt(intent.slots.Answer.value, 10) < (ANSWER_COUNT + 1)
        && parseInt(intent.slots.Answer.value, 10) > 0;
}

//=========================================================================================================================================
//Main export handler
//=========================================================================================================================================

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageString;
    alexa.registerHandlers(initialhandlers, startStateHandlers, triviaStateHandlers, helpStateHandlers);
    alexa.execute();
};
