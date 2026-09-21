import { ch, inp, fix, ord, group, table, examples, pit, no, yes, sticky, h3, p, ng, html } from "./_helpers.mjs";

const link = text => sticky(text, "Связь с курсом");
// Reading text: short paragraphs plus the words that may be new.
const text = (title, lines, words) => html(
  h3(title),
  `<div class="reading">${lines.map(l => `<p>${l}</p>`).join("")}</div>`,
  words ? ng(["Новые слова", words]) : ""
);

export default {
  slug: "texts",
  title: "Тексты: читаем и переводим",
  subtitle: "короткие тексты по темам курса, вопросы на понимание и перевод",
  position: 13,
  steps: false,
  sections: [
    {
      id: "about", nav: "Текст 1 · о себе", eyebrow: "Текст 1 · уроки 1–2", title: "About me",
      theory: html(
        p("Прочитайте текст. Незнакомые слова — в списке под ним. Потом ответьте на вопросы и переведите предложения."),
        text("Marina, 29", [
          "Hello! My <b>name's</b> Marina and <b>I'm</b> from Kazan. <b>I'm</b> 29 years old and <b>I'm</b> a nurse. I work in a small hospital near my house.",
          "I live with my husband and our daughter. Her <b>name's</b> Vera and <b>she's</b> six. My husband is an engineer. <b>He's</b> from Samara, so <b>he's</b> Russian too.",
          "My favourite month is May, because the weather is warm and my birthday is on the 12th of May. <b>I'm</b> interested in photography, but <b>I'm</b> not very good at it!",
        ], ["a nurse — медсестра", "a hospital — больница", "a husband — муж", "a daughter — дочь", "because — потому что", "warm — тёплый", "good at — хорош в чём-то"]),
        link("Урок 1: to be, страны и национальности · Урок 2: чьё это · Урок 4: месяцы")
      ),
      groups: [
        group("Правда или нет?", [
          ch("Marina is a doctor.", ["True", "False"], "False", "She's a nurse — медсестра."),
          ch("She lives in Kazan.", ["True", "False"], "True", "I'm from Kazan, I work near my house."),
          ch("Her daughter is six years old.", ["True", "False"], "True", "Her name's Vera and she's six."),
          ch("Her husband is from Kazan.", ["True", "False"], "False", "He's from Samara."),
          ch("Marina is a good photographer.", ["True", "False"], "False", "I'm not very good at it."),
        ]),
        group("Ответьте по тексту", [
          ch("How old is Marina?", ["She's 29.", "She's 6.", "She's 12."], "She's 29.", "I'm 29 years old."),
          ch("What does her husband do?", ["He's an engineer.", "He's a nurse.", "He's a photographer."], "He's an engineer.", "My husband is an engineer."),
          ch("When is her birthday?", ["In May.", "In March.", "In June."], "In May.", "my birthday is on the 12th of May."),
        ]),
        group("Переведите на английский", [
          inp("«Меня зовут Марина, я из Казани.»", ["My name's Marina and I'm from Kazan.", "My name is Marina and I am from Kazan.", "My name is Marina, I'm from Kazan."], "My name's… and I'm from…", "Переведите на английский"),
          inp("«Я медсестра.»", ["I'm a nurse.", "I am a nurse."], "Перед профессией — a.", "Переведите на английский"),
          inp("«Мой муж инженер.»", ["My husband is an engineer.", "My husband's an engineer."], "engineer → an.", "Переведите на английский"),
          inp("«Мой день рождения в мае.»", ["My birthday is in May."], "in + месяц.", "Переведите на английский"),
        ]),
      ],
    },
    {
      id: "flat", nav: "Текст 2 · квартира", eyebrow: "Текст 2 · урок 9", title: "Our flat",
      theory: html(
        text("Our flat", [
          "We live in a small flat on the fourth floor. <b>There are</b> three rooms: a living room, a bedroom and a kitchen.",
          "<b>There's</b> a big sofa in the living room and a lamp <b>next to</b> it. Our TV is <b>on</b> the wall, <b>opposite</b> the sofa. <b>There isn't</b> a table in this room, so we have dinner in the kitchen.",
          "Our building is <b>near</b> the metro station. <b>There are</b> two supermarkets and a pharmacy <b>in front of</b> the house, but <b>there aren't any</b> cafés in our street. That's the only problem!",
        ], ["a floor — этаж", "a wall — стена", "a building — здание", "the only — единственный", "a problem — проблема"]),
        link("Урок 9: there is / there are и предлоги места")
      ),
      groups: [
        group("Правда или нет?", [
          ch("They live on the fourth floor.", ["True", "False"], "True", "on the fourth floor."),
          ch("There is a table in the living room.", ["True", "False"], "False", "There isn't a table in this room."),
          ch("There are cafés in their street.", ["True", "False"], "False", "There aren't any cafés in our street."),
          ch("The building is near the metro.", ["True", "False"], "True", "Our building is near the metro station."),
        ]),
        group("Ответьте по тексту", [
          ch("How many rooms are there in the flat?", ["Three.", "Two.", "Four."], "Three.", "There are three rooms."),
          ch("Where is the TV?", ["On the wall, opposite the sofa.", "Next to the lamp.", "In the kitchen."], "On the wall, opposite the sofa.", "Our TV is on the wall, opposite the sofa."),
          ch("Where do they have dinner?", ["In the kitchen.", "In the living room.", "In a café."], "In the kitchen.", "we have dinner in the kitchen."),
        ]),
        group("Переведите на английский", [
          inp("«В квартире три комнаты.»", ["There are three rooms in the flat.", "There are three rooms in the apartment."], "three rooms → There are.", "Переведите на английский"),
          inp("«Рядом с диваном есть лампа.»", ["There is a lamp next to the sofa.", "There's a lamp next to the sofa."], "There is + next to.", "Переведите на английский"),
          inp("«В нашей улице нет кафе.»", ["There aren't any cafés in our street.", "There are not any cafes in our street.", "There aren't any cafes in our street."], "aren't any + cafés.", "Переведите на английский"),
        ]),
      ],
    },
    {
      id: "day", nav: "Текст 3 · день", eyebrow: "Текст 3 · уроки 4–5", title: "Sergey's day",
      theory: html(
        text("Sergey, a taxi driver", [
          "Sergey <b>is</b> a taxi driver in Moscow. He <b>works</b> five days a week and he <b>starts</b> work at two o'clock in the afternoon.",
          "He <b>gets up</b> at ten, <b>has</b> a shower and <b>makes</b> breakfast for his family. Then he <b>takes</b> his son to school. He <b>doesn't have</b> lunch at home — he usually <b>eats</b> a sandwich in the car.",
          "Sergey <b>finishes</b> work at midnight. He <b>gets</b> home at about one o'clock and <b>watches</b> TV for half an hour. He <b>goes</b> to bed at two. He <b>likes</b> his job, but he <b>doesn't like</b> the traffic.",
        ], ["a taxi driver — таксист", "midnight — полночь", "half an hour — полчаса", "traffic — пробки, движение"]),
        link("Урок 4: привычки · Урок 5: -s у he / she / it и распорядок дня")
      ),
      groups: [
        group("Правда или нет?", [
          ch("Sergey starts work in the morning.", ["True", "False"], "False", "He starts work at two in the afternoon."),
          ch("He has lunch at home.", ["True", "False"], "False", "He doesn't have lunch at home."),
          ch("He takes his son to school.", ["True", "False"], "True", "Then he takes his son to school."),
          ch("He goes to bed at two.", ["True", "False"], "True", "He goes to bed at two."),
        ]),
        group("Ответьте по тексту", [
          ch("What time does he get up?", ["At ten.", "At two.", "At midnight."], "At ten.", "He gets up at ten."),
          ch("Where does he usually eat lunch?", ["In the car.", "At home.", "In a café."], "In the car.", "he usually eats a sandwich in the car."),
          ch("What doesn't he like?", ["The traffic.", "His job.", "TV."], "The traffic.", "he doesn't like the traffic."),
        ]),
        group("Переведите на английский", [
          inp("«Он работает пять дней в неделю.»", ["He works five days a week."], "he → works.", "Переведите на английский"),
          inp("«Он не обедает дома.»", ["He doesn't have lunch at home.", "He does not have lunch at home."], "doesn't have lunch.", "Переведите на английский"),
          inp("«Во сколько он заканчивает работу?»", ["What time does he finish work?", "When does he finish work?"], "What time + does + he + finish work?", "Переведите на английский"),
        ]),
      ],
    },
    {
      id: "weekend", nav: "Текст 4 · выходные", eyebrow: "Текст 4 · урок 7", title: "Last weekend",
      theory: html(
        text("A message from a friend", [
          "Hi! How <b>was</b> your weekend? Mine <b>was</b> great.",
          "On Saturday morning I <b>got up</b> late and <b>had</b> a big breakfast. Then I <b>met</b> my friends in the centre and we <b>went</b> to a new café. The coffee <b>was</b> excellent, but the cake <b>wasn't</b> very good.",
          "In the evening we <b>watched</b> a film at home. I <b>didn't go</b> out on Sunday, because the weather <b>was</b> terrible. I <b>stayed</b> at home and <b>read</b> a book. What <b>did</b> you <b>do</b>?",
        ], ["mine — мой (без предмета)", "the centre — центр города", "excellent — отличный", "terrible — ужасный", "to stay — оставаться"]),
        link("Урок 7: was / were, -ed, неправильные глаголы, didn't")
      ),
      groups: [
        group("Правда или нет?", [
          ch("He got up early on Saturday.", ["True", "False"], "False", "I got up late."),
          ch("The coffee in the café was good.", ["True", "False"], "True", "The coffee was excellent."),
          ch("He went out on Sunday.", ["True", "False"], "False", "I didn't go out on Sunday."),
          ch("The weather was bad on Sunday.", ["True", "False"], "True", "the weather was terrible."),
        ]),
        group("Ответьте по тексту", [
          ch("Where did he meet his friends?", ["In the centre.", "At home.", "In the park."], "In the centre.", "I met my friends in the centre."),
          ch("What did they do in the evening?", ["They watched a film.", "They went to a café.", "They read a book."], "They watched a film.", "we watched a film at home."),
          ch("Why didn't he go out on Sunday?", ["Because the weather was terrible.", "Because he was ill.", "Because he was at work."], "Because the weather was terrible.", "because the weather was terrible."),
        ]),
        group("Переведите на английский", [
          inp("«Как прошли твои выходные?»", ["How was your weekend?"], "How + was + your weekend?", "Переведите на английский"),
          inp("«Мы сходили в новое кафе.»", ["We went to a new café.", "We went to a new cafe."], "go → went.", "Переведите на английский"),
          inp("«В воскресенье я не выходил из дома.»", ["I didn't go out on Sunday.", "I did not go out on Sunday."], "didn't + go out.", "Переведите на английский"),
          inp("«Погода была ужасная.»", ["The weather was terrible."], "weather = it → was.", "Переведите на английский"),
        ]),
      ],
    },
    {
      id: "cafe", nav: "Текст 5 · в кафе", eyebrow: "Текст 5 · уроки 10 и 12", title: "In a café",
      theory: html(
        text("A conversation", [
          "— Good morning! What would you like?",
          "— Good morning. <b>Can I have</b> a coffee and a cheese sandwich, please?",
          "— Sure. <b>Would you like</b> anything else?",
          "— Yes, <b>I'd like</b> a bottle of water too. And <b>can you</b> tell me the wi-fi password?",
          "— Of course, it's on the menu. <b>That's</b> £8.40, please.",
          "— Here you are. Thank you!",
        ], ["a password — пароль", "of course — конечно", "anything else — что-нибудь ещё", "Here you are — вот, пожалуйста"]),
        link("Урок 10: Can I…? и Can you…? · Урок 12: I'd like и цены")
      ),
      groups: [
        group("Правда или нет?", [
          ch("The customer orders tea.", ["True", "False"], "False", "Can I have a coffee…"),
          ch("The customer wants water too.", ["True", "False"], "True", "I'd like a bottle of water too."),
          ch("The wi-fi password is on the menu.", ["True", "False"], "True", "it's on the menu."),
        ]),
        group("Выберите фразу", [
          ch("Вежливо попросить кофе:", ["Can I have a coffee, please?", "I want a coffee.", "Give me a coffee."], "Can I have a coffee, please?", "Can I have…? — вежливая просьба."),
          ch("Спросить, сколько всего:", ["How much is that altogether?", "How many is that?", "What is the money?"], "How much is that altogether?", "How much + altogether."),
          ch("Попросить о помощи:", ["Can you help me, please?", "Can I help you, please?", "Do you can help me?"], "Can you help me, please?", "Can you…? — просьба к собеседнику."),
        ]),
        group("Переведите на английский", [
          inp("«Можно мне кофе и бутерброд, пожалуйста?»", ["Can I have a coffee and a sandwich, please?"], "Can I have + a coffee and a sandwich.", "Переведите на английский"),
          inp("«Я бы хотел бутылку воды.»", ["I'd like a bottle of water.", "I would like a bottle of water."], "I'd like + a bottle of water.", "Переведите на английский"),
          inp("«Сколько с меня?»", ["How much is that?", "How much is it?", "How much is that altogether?"], "How much is that?", "Переведите на английский"),
        ]),
      ],
    },
    {
      id: "mix", nav: "Текст 6 · всё вместе", eyebrow: "Текст 6 · весь курс", title: "A letter from Nick",
      theory: html(
        text("Nick, 34, London", [
          "Hi! <b>I'm</b> Nick and I <b>live</b> in London with my wife and two children. I <b>work</b> as a journalist, so I <b>write</b> a lot every day.",
          "We<b>'ve got</b> a small house near a park. <b>There's</b> a garden behind the house and my children <b>love</b> playing there. Right now they <b>are playing</b> football with our dog!",
          "I usually <b>get up</b> at seven, but last Saturday I <b>got up</b> at eleven, because we <b>had</b> a party on Friday night. It <b>was</b> my wife's birthday. We <b>didn't cook</b> — we <b>ordered</b> pizza and <b>watched</b> films.",
          "I <b>can't</b> cook very well, but I <b>can</b> make good coffee. Come and visit us — I<b>'d like</b> to show you the city!",
        ], ["a wife — жена", "to order — заказывать", "to show — показать", "Come and visit us — приезжайте в гости"]),
        p("Этот текст собран из всех тем курса: to be, have got, there is, Present Simple и Continuous, Past Simple, can и I'd like.")
      ),
      groups: [
        group("Правда или нет?", [
          ch("Nick lives in London.", ["True", "False"], "True", "I live in London."),
          ch("He has got a big flat.", ["True", "False"], "False", "We've got a small house."),
          ch("His children are playing football now.", ["True", "False"], "True", "Right now they are playing football."),
          ch("They cooked dinner for the party.", ["True", "False"], "False", "We didn't cook — we ordered pizza."),
          ch("Nick can cook very well.", ["True", "False"], "False", "I can't cook very well."),
        ]),
        group("Найдите время в предложении", [
          ch("«I work as a journalist» — это про…", ["постоянную работу", "сейчас", "прошлое"], "постоянную работу", "Present Simple — постоянно."),
          ch("«They are playing football» — это про…", ["сейчас", "каждый день", "прошлое"], "сейчас", "Present Continuous — прямо сейчас."),
          ch("«We ordered pizza» — это про…", ["прошлое", "сейчас", "планы"], "прошлое", "Past Simple."),
          ch("«I can make good coffee» — это про…", ["умение", "прошлое", "сейчас"], "умение", "can — умение."),
        ]),
        group("Переведите на английский", [
          inp("«У нас есть маленький дом.»", ["We've got a small house.", "We have got a small house.", "We have a small house."], "have got / have.", "Переведите на английский"),
          inp("«За домом есть сад.»", ["There is a garden behind the house.", "There's a garden behind the house."], "There is + behind.", "Переведите на английский"),
          inp("«В прошлую субботу я встал в одиннадцать.»", ["Last Saturday I got up at eleven.", "I got up at eleven last Saturday."], "get up → got up.", "Переведите на английский"),
          inp("«Я не умею хорошо готовить.»", ["I can't cook very well.", "I cannot cook very well.", "I can't cook well."], "can't + cook.", "Переведите на английский"),
          inp("«Я бы хотел показать вам город.»", ["I'd like to show you the city.", "I would like to show you the city."], "I'd like + to show.", "Переведите на английский"),
        ]),
      ],
    },
  ],
};
