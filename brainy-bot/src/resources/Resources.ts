export const enUS = {
  adaptiveCards: {
    meetingActionTitle: "📅 Schedule team meeting",
    submitActionTitle: "Submit",
    genericGreetingText: "👋 Hi, it's Brainy!",
    taskUrlActionTitle: "🌐 Resources",
    welcomeTeamCard: {
      welcomeTeamCardIntroTextBlockText:
        "Nice to see that I was added to this team.",
    },
    tourActionTitle: "Take a tour",
    iconImageUrl: function () {
      return `${process.env.BASE_DOMAIN}/assets/brainy.png`;
    },
    tourActionUrl: function () {
      return `https://teams.microsoft.com/l/task/${
        process.env.APP_ID
      }?url=${encodeURIComponent(
        `${process.env.BASE_DOMAIN}/assets/tour.html?theme={theme}`
      )}&height=533px&width=600px&title=Get to know Brainy`;
    },
    chatActionTitle: function (name: string) {
      return `💬 Chat with ${name}`;
    },
    chatWithManagerActionTitle: function (name: string) {
      return `💬 Chat with manager ${name}`;
    },
    chatWithTaskownerActionTitle: function (name: string) {
      return `💬 Chat with task owner ${name}`;
    },
    addTaskCard: {
      intro1TextBlockText:
        "I am here to help you find the right person to collaborate with. First, I'd like to know a few things about your project.",
      intro2TextBlockText: "Help me out with some details.",
      taskCustomerNameTextInputPlaceHolder: "Customer name",
      taskNameTextInputPlaceholder: "Task name",
      taskGoalTextInputPlaceholder: "Desired outcome",
      taskSkillsNeededTextInputPlaceholder: "Skills needed",
      taskTypeTextInputPlaceholder: "Type (e.g. workshop, design session)",
      taskUrlTextInputPlaceholder: "Resources URL",
      taskLengthTextBlockText: "This task will approximately take..",
      taskLengthValueNumberInputPlaceholder: "Value",
      taskLengthUnitChoiceSetPlaceholder: "Unit",
      taskLengthUnitChoiceSetValues: {
        hourTitle: "Hour(s)",
        dayTitle: "Day(s)",
        weekTitle: "Week(s)",
        monthTitle: "Month(s)",
      },
    },
    requestDeniedCard: {
      requestDeniedTextBlockText: function (
        taskName: string,
        customer: string,
        denierName: string
      ) {
        return `Sorry, the request ${taskName} for ${customer} has been denied by ${denierName}.`;
      },
      showDenierCommentActionTitle: function (name: string) {
        return `Show the comment from ${name}`;
      },
      editTaskActionTitle: "✏️ Edit this task",
    },
    newTaskCard: {
      newTaskIntro1TextBlockText: "A new task was assigned to you!",
      newTaskIntro2TextBlockText: function (name: string) {
        return `Hey there, ${name} just posted a new task. Click on accept if you want to take on this challenge, or schedule a meeting for more information.`;
      },
      supportingArchitectIntroTextBlockText:
        "You've been asked to work together with the following awesome architects:",
      endSloganTextBlockText: "See, finding projects *is* easy!",
      showManagerCommentActionTitle: function (name: string) {
        return `Show manager ${name}'s comment`;
      },
      showMoreOptionsActionTitle: "Show more options",
    },
    welcomeTaskownerCard: {
      welcomeIntroTextBlockText:
        "I am here to team you up with the help that you are looking for.",
      startActionTitle: "Start using Brainy",
    },
    addTaskFeedbackCard: {
      feedbackIntroTextBlockText:
        "Please add a rating and/or comment about your experience with this task.",
      feedbackRatingTextBlockText: "How did this experience make you feel?",
      negativeRatingActionTitle: "☹️",
      neutralRatingActionTitle: "😐",
      positiveRatingActionTitle: "😀",
    },
    confirmTaskCard: {
      confirmationTextBlockText:
        "You got it, I will come back to you 👍 Let me know if I can do anything else in the meantime.",
    },
    optoutCard: {
      optoutIntroTextBlockText:
        "All set. I've paused your matches. You can turn them back on whenever you like.",
      resumeAvailabilityActionTitle: "⏯️ Resume availability",
      resumeAvailabilityDisplayText: "I'm ready for some new tasks. 💪",
    },
    postTaskActionTitle: "➕ Post a new task",
    postTaskActionDisplayText: "I've got some more work for you. 😏",
    acceptActionTitle: "✔️ Accept",
    declineActionTitle: "❌ Decline",
    taskCustomerFactTitle: "Customer:",
    taskNameFactTitle: "Task name:",
    taskTypeFactTitle: "Task type:",
    taskLengthFactTitle: "Approximate length:",
    taskGoalFactTitle: "Desired outcome:",
    taskRequiredSkillsFactTitle: "Skills needed:",
    optionalCommentTextInputPlaceholder: "Enter your comment here (optional)",
    requiredCommentTextInputPlaceholder: "Enter your comment here (required)",
    confirmDeclineActionTitle: "Confirm decline",
    chooseSpecialistCard: {
      chooseSpecialistTextBlockText: "Please select an available task executor",
    },
    chatLink: function (
      userUpn: string,
      name: string,
      taskName: string,
      customer: string
    ) {
      const chatMessage = encodeURIComponent(
        `Hi ${name}, regarding ${taskName} for ${customer}:`
      );
      return `https://teams.microsoft.com/l/chat/0/0?users=${userUpn}&message=${chatMessage}%20`;
    },
    meetingLinkWihoutAttendees: function (customer: string) {
      const meetingMessage = encodeURIComponent(
        `Discussing task at ${customer}`
      );
      return `https://teams.microsoft.com/l/meeting/new?subject=${meetingMessage}`;
    },
    taskAcceptedCard: {
      acceptedIntroTextBlockText:
        "Great choice! This project might take some time, so if you want to pause your availability for now, please do so. You can also create a new task yourself whenever you'd like.",
      pauseAvailabilityActionTitle: "⏸️ Pause availability",
    },
    specialistFoundTaskownerCard: {
      specialistFoundIntro1TextBlockText: "I got you covered!",
      specialistFoundIntro2TextBlockText: function (
        name: string,
        taskSubject: string,
        customer: string
      ) {
        return `Hey there, you will collaborate with ${name} on the task ${taskSubject} for ${customer}. How great is this?!`;
      },
      endSloganTextBlockText: "See, finding resources *is* easy!",
    },
    qualifyTaskCard: {
      qualifyTaskIntroTextBlockText: function (name: string) {
        return `${name} just posted a new task. Here are some details: `;
      },
      assignSpecialistActionTitle: "👉 Assign",
      mainTextBox:
        "We need someone on board! What are you going to do about it?",
    },
  },
  assignmentNotification: function (
    managerName: string,
    specialistName: string,
    comment: string
  ) {
    return `👉 *${managerName} has assigned this task to ${specialistName}, with the following comment: ${comment}*`;
  },
  managerDeclineNotification: function (managerName: string, comment: string) {
    return `❌ *${managerName} has declined this task, with the following comment: ${comment}.*`;
  },
  specialistDeclineNotification: function (
    specialistName: string,
    comment: string
  ) {
    return `😔 *${specialistName} has declined this task, with the following comment: ${comment}.*`;
  },
  acceptNotification: function (specialistName: string) {
    return `✔️ *${specialistName} has accepted this task. How great is this?!*`;
  },
  optinNotification:
    "That's the spirit! I'll let you know when you are assigned to a new task again.",
  feedbackThanks: "Thanks for your feedback!",
  specialistDeclineConfirmation:
    "No hard feelings! I'll let your manager know. We'll try again next time 😄",
  noAssignmentComment: "There is no comment on this task.",
  exceptions: {
    information: {
      noAvailableSpecialists:
        "Sorry, all task executors are currently busy.. Please try again later",
      taskAssignmentNotAllowed:
        "Hold on! You cannot assign the chosen task executor to the task at this time.",
      specialistNotSelected:
        "Whoops! You did not select anyone. Please try again.",
      newTaskFormDataMissing:
        "Whoopsie! You did not fill in all form fields correctly. Please try again.",
      newTaskFormValidUrlMissing:
        "It seems like you did not submit a proper HTTPS link in the form.",
      feedbackSubmissionFailed:
        "Whoopsie! You can't submit feedback to this task.",
      declineCommentMissing: "Please fill in a comment before declining.",
      taskUnmodifiable:
        "Sorry.. You can't modify the status of this task right now.",
    },
    warning: {
      managerRoleDenied:
        "Sorry, you're not allowed to act as a manager in this Teams channel. Please contact your local Brainy administrators to configure your role.",
      specialistRoleDenied:
        "Sorry, you're not allowed to act as a task executor. Please contact your local Brainy administrators to configure your role.",
    },
    error: {
      illegalTenant: "Sorry! I'm not allowed to send messages in this tenant.",
      taskNotFound: "Oops! I could not find this task in my database.",
      userNotFound:
        "Oops! The user I am trying to send a message to can't be reached. Is this user added to the main Brainy team?",
    },
    critical: {
      managerTeamNotFound:
        "Something went wrong and I couldn't find the manager team.. Please reach out to your Brainy administrators.",
      unknownFailure:
        "Oops. Something went wrong! Please try again later. If this problem persists, reach out to your local Brainy administrators.",
      genericSqlDatabaseQueryFailure:
        "Whoopsie, I could not perform this action in my database. Please reach out to your local Brainy admins.",
      unknownMessage:
        "I don't understand this message. If you typed a message, please know that I do not support conversations.",
    },
  },
};
