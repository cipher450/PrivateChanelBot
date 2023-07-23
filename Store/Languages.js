let selectedLanguage = null;
const config = require("../config/config");
const french = {
  WelcomeMessage: `Bienvenue sur notre Bot d'inscription aux Chaînes Premium pour ${config.groupeConfig.groupeName1}
  
  👋 Merci d'avoir choisi notre Bot d'inscription aux Chaînes Premium. Inscrivez-vous pour accéder au contenu exclusif et aux chaînes premium dès aujourd'hui !
  
  🔒 Suivez les instructions pour vous inscrire aux chaînes premium de votre choix. Profitez du meilleur contenu sans tracas !
        `,
  Newuser: `Il semble que vous n'êtes pas encore abonné à l'une de nos chaînes VIP.`,
  support: `Si vous rencontrez des problèmes, veuillez contacter ${config.adminProps.SupportName}`,
  commands:`Voici une liste des commandes possibles :\n
            
/start - S'inscrire à une chaîne ou voir l'état du compte
/checkPay - Voir l'état du paiement
            /join - Générer un lien d'invitation
            /help - Voir la liste des commandes

            Vous aimez ce bot ? Contactez @echo994
            `,
  signup: {
    packageType: `Quel forfait souhaitez-vous ?
              👉 1 Mois - ${config.groupeConfig.price1}$
              👉 3 Mois - ${config.groupeConfig.price3}$
              👉 6 Mois - ${config.groupeConfig.price6}$
              👉 12 Mois - ${config.groupeConfig.price12}$
    `,

    infoVerify: "\nCes informations sont-elles correctes ? Si oui, sélectionnez Continuer",

    paymentMessage:
      "Veuillez envoyer le montant correct à l'adresse correcte sur le bon réseau",
    paymentConfirmation:
      "Cliquez ci-dessous lorsque la transaction est terminée, cela peut prendre un certain temps (/checkPay pour voir l'état de la transaction)",
    invite: `Rejoignez en utilisant ce lien d'invitation, il expirera dans 5 minutes.`,
    alreadyMembre: "Vous êtes déjà membre, vous ne pouvez pas générer un nouveau lien d'invitation",
     
  },
  paymentCheck: {
    awaiting: "Vous n'avez pas encore envoyé l'argent, voici l'adresse USDT TRC20 :",
    failed:
      "Il semble que le paiement ait échoué ou a expiré, voici un nouvel ordre de paiement :",
  },
  buttons: {
    continue: "Continuer",
    reject: "Rejeter",
    signup: "S'inscrire",
    knowmore: "En savoir plus",
    thebot: "BOT",
    channel: "Chaîne",
    back: "Retour",
    pack1: "1 Mois",
    pack2: "3 Mois",
    pack3: "6 Mois",
    pack4: "12 Mois",
    confirm: "J'ai payé",
  },
};
const arabic = {
  WelcomeMessage: `مرحبًا بك في بوت تسجيل الانضمام إلى قنوات Premium لدينا ${config.groupeConfig.groupeName1}

  👋 شكرًا لاختيارك بوت تسجيل الانضمام إلى قنوات Premium لدينا. قم بالتسجيل للحصول على محتوى حصري والوصول إلى قنوات Premium اليوم!
  
  🔒 اتبع التعليمات للتسجيل في القنوات البريميوم التي تفضلها. استمتع بأفضل المحتوى بدون أي متاعب!
        `,
  Newuser: `يبدو أنك لم تشترك بعد في أي من قنوات VIP لدينا.`,
  support: `إذا كان لديك مشكلة، يرجى الرجوع إلى ${config.adminProps.SupportName}`,
  commands: `إليك قائمة بالأوامر الممكنة:\n

            /start - الاشتراك في القناة أو عرض حالة الحساب
            /checkPay - مراجعة حالة الدفع
            /join - إنشاء رابط دعوة
            /help - عرض قائمة الأوامر

            هل أعجبك هذا البوت؟ اتصل بـ @echo994
            `,
  signup: {
    packageType: `أي باقة ترغب في الحصول عليها؟
              👉 1 شهر - ${config.groupeConfig.price1}$
              👉 3 أشهر - ${config.groupeConfig.price3}$
              👉 6 أشهر - ${config.groupeConfig.price6}$
              👉 12 شهر - ${config.groupeConfig.price12}$
    `,

    infoVerify: "\nهل هذه المعلومات صحيحة؟ إذا كانت كذلك، حدد متابعة",

    paymentMessage:
      "يرجى إرسال المبلغ الصحيح إلى العنوان الصحيح على الشبكة الصحيحة",
    paymentConfirmation:
      "انقر أدناه عندما يتم الانتهاء من عملية الدفع. قد يستغرق بعض الوقت (/checkPay لرؤية حالة العملية)",
    invite: `انضم باستخدام رابط الدعوة هذا، سينتهي الرابط في غضون 5 دقائق.`,
    alreadyMembre: "أنت بالفعل عضو، لا يمكنك إنشاء رابط دعوة جديد",
     
  },
  paymentCheck: {
    awaiting: "لم ترسل المال بعد، إليك عنوان USDT TRC20 :",
    failed:
      "يبدو أن الدفع قد فشل أو انتهت صلاحيته، إليك أمر دفع جديد:",
  },
  buttons: {
    continue: "متابعة",
    reject: "رفض",
    signup: "الاشتراك",
    knowmore: "معرفة المزيد",
    thebot: "روبوت",
    channel: "قناة",
    back: "العودة",
    pack1: "1 شهر",
    pack2: "3 أشهر",
    pack3: "6 أشهر",
    pack4: "12 شهر",
    confirm: "لقد دفعت",
  },
};
const spanish = {
  WelcomeMessage: `¡Bienvenido a nuestro Bot de Registro de Canales Premium para ${config.groupeConfig.groupeName1}
  
  👋 Gracias por elegir nuestro Bot de Registro de Canales Premium. ¡Regístrese para acceder al contenido exclusivo y a los canales premium hoy mismo!
  
  🔒 Siga las instrucciones para registrarse en los canales premium de su elección. ¡Disfrute del mejor contenido sin complicaciones!
        `,
  Newuser: `Parece que aún no está suscrito a ninguno de nuestros canales VIP.`,
  support: `Si tiene algún problema, consulte a ${config.adminProps.SupportName}`,
  commands: `Aquí tienes una lista de los posibles comandos:\n
            
            /start - Registrarse en el canal o ver el estado de la cuenta
            /checkPay - Ver el estado del pago
            /join - Generar un enlace de invitación
            /help - Ver la lista de comandos

            ¿Te gusta este bot? Contacta a @echo994
            `,
  signup: {
    packageType: `¿Qué plan deseas?
              👉 1 Mes - ${config.groupeConfig.price1}$
              👉 3 Meses - ${config.groupeConfig.price3}$
              👉 6 Meses - ${config.groupeConfig.price6}$
              👉 12 Meses - ${config.groupeConfig.price12}$
    `,

    infoVerify: "\n¿Son correctos estos datos? Si es así, selecciona Continuar",

    paymentMessage:
      "Por favor, envía la cantidad correcta a la dirección correcta en la red correcta",
    paymentConfirmation:
      "Haz clic a continuación cuando se haya completado la transacción. Puede llevar un tiempo (/checkPay para ver el estado de la transacción)",
    invite: `Únete usando este enlace de invitación, caducará en 5 minutos.`,
    alreadyMembre: "Ya eres miembro, no puedes generar un nuevo enlace de invitación",
     
  },
  paymentCheck: {
    awaiting: "Todavía no has enviado el dinero, aquí está la dirección USDT TRC20:",
    failed:
      "Parece que el pago falló o expiró, aquí tienes una nueva orden de pago:",
  },
  buttons: {
    continue: "Continuar",
    reject: "Rechazar",
    signup: "Registrarse",
    knowmore: "Saber más",
    thebot: "BOT",
    channel: "Canal",
    back: "Volver",
    pack1: "1 Mes",
    pack2: "3 Meses",
    pack3: "6 Meses",
    pack4: "12 Meses",
    confirm: "He pagado",
  },
};

const russian = {};
const chinesse = {};
const german = {}
const english = {
  WelcomeMessage: `Welcome to our Premium Channels Signup Bot for ${config.groupeConfig.groupeName1}!  
  
  👋 Thank you for choosing our Premium Channels Signup Bot. Sign up for exclusive content and access premium channels today!
  
  🔒 Follow the instructions to register for your preferred premium channels. Enjoy the best content hassle-free!
`,
  Newuser: `It looks like you are not yet subscribed to any of our VIP channels.`,
  support: `If you're having trouble, please refer to ${config.adminProps.SupportName}.`,
  commands:`Here is a list of the possible commands:

/start - Signup to a channel or view account status
/checkPay - See payment status
/join - Generate an invite link
/renew - renew you'r subscription
/help - See the command list


if you have any problem contact ${config.adminProps.SupportName}

Like this bot? Contact 👨‍💻 @echo994.`,
  signup: {
    packageType: `Which plan do you want?
👉 1 Month - ${config.groupeConfig.price1}$
👉 3 Months - ${config.groupeConfig.price3}$
👉 6 Months - ${config.groupeConfig.price6}$
👉 12 Months - ${config.groupeConfig.price12}$
`,

    infoVerify: "\nAre these pieces of information correct? If yes, select continue.",

    paymentMessage:
      "Please send the correct amount to the correct address on the correct network.",
    paymentConfirmation:
      "Click below when the transaction is completed it may take some time (/checkPay to see the transaction status).",
    invite: `Join using this invite link it will expire in 5 minutes.`,
    alreadyMembre: "You are already in you cannot generate a new invite link.",
    planDone:"⏳ it sems that you have no day's left click on the button bellow or do /renew",
    dayzLeft:`it looks like you'r subscription is not yet done you have `,
    dayzLeft2:` day's left.`
  },
  paymentCheck: {
    awaiting: "You have not sent the money yet. Here is the USDT TRC20 Address:",
    failed:
      "It looks like the payment either failed or expired. Here is a new payment order:",
    
  },

  buttons: {
    continue: "Continue",
    reject: "Reject",
    signup: "Sign up",
    knowmore: "Know More",
    thebot: "BOT",
    channel: "Channel",
    back: "Go Back",
    pack1: "1 Month",
    pack2: "3 Months",
    pack3: "6 Months",
    pack4: "12 Months",
    confirm: "I have paid",
  },
};



module.exports = {
  french,
  english,
  arabic,
  spanish,
  selectedLanguage,
};
