import { ch, inp, fix, ord, group, formula, table, examples, pit, no, yes, sticky, h3, p, compare, ng, html, extend } from "./_helpers.mjs";

const lesson = {
  slug: "questions-do-does",
  title: "Вопросы: do, does и to be",
  subtitle: "Do you ever…?, Where do you…?, How often, to be или do, свободное время, much / many",
  position: 6,
  sections: [
    {
      id: "yn", nav: "Do you…?", eyebrow: "Тема 1 · вопрос да / нет", title: "Do you ever go to the theatre?",
      theory: html(
        p("Вспомним: вопрос в Present Simple начинается с <b>Do</b> или <b>Does</b>. Глагол после них — всегда в словарной форме."),
        formula("!Do · Does", "кто", "глагол", "остальное", "?"),
        table(["Вопрос", "Да", "Нет"], [
          ["<mark>Do</mark> you play sport?", "Yes, I do.", "No, I don't."],
          ["<mark>Does</mark> she live here?", "Yes, she does.", "No, she doesn't."],
        ]),
        h3("ever — «вообще, когда-нибудь»"),
        p("<b>ever</b> в вопросе значит «хоть иногда, вообще». Ставится перед глаголом."),
        examples([
          ["Ты вообще ходишь в театр?", "Do you <mark>ever</mark> go to the theatre?", "— Yes, I do. About once a year."],
          ["Ты когда-нибудь ходишь в кино один?", "Do you <mark>ever</mark> go to the cinema on your own?"],
          ["Она вообще занимается спортом?", "Does she <mark>ever</mark> do sport?", "— No, she doesn't."],
        ]),
        pit(
          `Без Do вопрос не получится: ${no("You play the piano?")} ${yes("Do you play the piano?")}`,
          `Do / Does — в начале, глагол — после «кто»: ${no("Do play you video games?")} ${yes("Do you play video games?")}`,
          `Не отвечайте глаголом: ${no("Yes, I play.")} ${yes("Yes, I do.")}`
        ),
        sticky("Do you ever go to the cinema on your own? · Do you play the piano? · Do you like…? · Yes, I do / No, I don't / yes, he does / no, he doesn't")
      ),
      groups: [
        group("Do или Does?", [
          ch("___ you get up early?", ["Do", "Does"], "Do", "you → Do."),
          ch("___ he know Jenny?", ["Do", "Does"], "Does", "he → Does."),
          ch("___ your parents live near you?", ["Do", "Does"], "Do", "parents = they → Do."),
          ch("___ she drink coffee?", ["Do", "Does"], "Does", "she → Does."),
          ch("___ Ron and Jan live here?", ["Do", "Does"], "Do", "Ron and Jan = they → Do."),
        ]),
        group("Выберите короткий ответ", [
          ch("Does he know Jenny? — Yes, he ___. They're good friends.", ["does", "knows", "do"], "does", "Yes, he does."),
          ch("Does she drink coffee? — No, she ___. She drinks tea.", ["doesn't", "don't", "isn't"], "doesn't", "No, she doesn't."),
          ch("Do they work at the hospital? — Yes, they ___.", ["do", "does", "work"], "do", "Yes, they do."),
          ch("Do you ever go to concerts? — No, I ___.", ["don't", "doesn't", "never"], "don't", "No, I don't."),
        ]),
        group("Соберите вопрос (как в учебнике)", [
          ord("Do you ever play video games?", "Do + you + ever + play + video games?"),
          ord("Do you play the piano?", "Do + you + play + the piano?"),
          ord("Does your brother ever cook dinner?", "Does + your brother + ever + cook + dinner?"),
        ]),
      ],
    },
    {
      id: "wh", nav: "Where do you…?", eyebrow: "Тема 2 · вопрос со словами", title: "Where do you live? How often does she…?",
      theory: html(
        p("Вопросительное слово ставим <b>в самое начало</b>. Дальше порядок такой же, как в вопросе «да / нет»."),
        formula("вопр. слово", "!do · does", "кто", "глагол", "остальное", "?"),
        table(["Вопрос", "Перевод"], [
          ["<mark>Where do</mark> you live?", "Где ты живёшь?"],
          ["<mark>What time do</mark> you get up?", "Во сколько ты встаёшь?"],
          ["<mark>When does</mark> she watch TV?", "Когда она смотрит телевизор?"],
          ["<mark>How often do</mark> you go to the gym?", "Как часто ты ходишь в спортзал?"],
          ["<mark>What music do</mark> you listen to?", "Какую музыку ты слушаешь?"],
          ["<mark>How many times a year do</mark> you go to the cinema?", "Сколько раз в год ты ходишь в кино?"],
          ["<mark>What do</mark> you do at the weekend?", "Что ты делаешь по выходным?"],
          ["<mark>How does</mark> he travel to work?", "Как он добирается до работы?"],
        ]),
        h3("Предлог — в конце"),
        p("Если глагол требует предлога (listen <b>to</b>, look <b>at</b>, talk <b>about</b>), в вопросе предлог уходит <b>в конец</b>."),
        examples([
          ["Какую музыку ты слушаешь?", "What music do you listen <mark>to</mark>?"],
          ["О чём ты думаешь?", "What are you thinking <mark>about</mark>?"],
        ]),
        h3("Как составить вопрос к ответу"),
        examples([
          ["Я живу в Мадриде.", "I live <u>in Madrid</u>. → <mark>Where do</mark> you live?"],
          ["Он работает в Мельбурне.", "He works <u>in Melbourne</u>. → <mark>Where does</mark> he work?"],
          ["Я встаю в 6.", "I get up <u>at six o'clock</u>. → <mark>What time do</mark> you get up?"],
          ["Картина стоит 2000 фунтов.", "The painting costs <u>£2000</u>. → <mark>How much does</mark> it cost?", "или How much is it?"],
        ]),
        pit(
          `Не пропускайте do / does: ${no("Where you live?")} ${yes("Where do you live?")}`,
          `После does глагол без -s: ${no("Where does she lives?")} ${yes("Where does she live?")}`,
          `«Во сколько» — What time, а не How late: ${no("How late do you go to bed?")} ${yes("What time do you go to bed?")}`,
          `Цена: ${no("How much does it costs?")} ${yes("How much does it cost?")} ${yes("How much is it?")}`
        ),
        sticky("where does she live? · Where do you listen to music? · How often do you watch TV? · How many times a year do you go to the cinema? · How much is this painting? / how much does it cost?")
      ),
      groups: [
        group("Выберите правильный вопрос", [
          ch("«Где работает твой папа?»", ["Where does your dad work?", "Where your dad works?", "Where does your dad works?"], "Where does your dad work?", "Where + does + your dad + work?", { "Where your dad works?": "Пропущено does.", "Where does your dad works?": "После does — work, без -s." }),
          ch("«Во сколько ты встаёшь?»", ["What time do you get up?", "How late do you get up?", "What time you get up?"], "What time do you get up?", "Время → What time."),
          ch("«Какую музыку ты слушаешь?»", ["What music do you listen to?", "What music do you listen?", "To what music you listen?"], "What music do you listen to?", "listen to — to в конце."),
          ch("«Сколько это стоит?»", ["How much does it cost?", "How much does it costs?", "How many does it cost?"], "How much does it cost?", "How much + does + it + cost."),
        ]),
        group("Задайте вопрос по-английски", [
          inp("She lives in Madrid.", ["Where does she live?"], "Where + does + she + live?", "Спросите: «Где она живёт?»"),
          inp("I listen to music two or three times a week.", ["How often do you listen to music?"], "How often + do + you + listen to music?", "Спросите: «Как часто ты слушаешь музыку?»"),
          inp("He works in Melbourne.", ["Where does he work?"], "Where + does + he + work?", "Спросите: «Где он работает?»"),
          inp("I get up at six o'clock.", ["What time do you get up?", "When do you get up?"], "What time + do + you + get up?", "Спросите: «Во сколько ты встаёшь?»"),
          inp("She watches TV in the living room.", ["Where does she watch TV?"], "Where + does + she + watch TV?", "Спросите: «Где она смотрит телевизор?»"),
          inp("We go to bed at ten o'clock.", ["What time do you go to bed?", "When do you go to bed?"], "What time + do + you + go to bed?", "Спросите: «Во сколько вы ложитесь спать?»"),
          inp("Heather only eats meat on Mondays.", ["When does Heather eat meat?", "When does she eat meat?"], "When + does + Heather + eat meat?", "Спросите: «Когда Хизер ест мясо?»"),
        ]),
        group("Соберите вопрос", [
          ord("How often do you watch TV?", "How often + do + you + watch TV?"),
          ord("Where does Harry study?", "Where + does + Harry + study?", [], ["Harry"]),
          ord("What do you do at the weekend?", "What + do + you + do + at the weekend?"),
          ord("How many times a year do you go to the cinema?", "How many times a year + do + you + go to the cinema?"),
        ]),
        group("Нажмите на неправильное слово", [
          fix("Where does she lives?", "lives", "live", "После does — live."),
          fix("What time you get up?", "you", "do you", "Нужен do: What time do you get up?"),
          fix("How much does it costs?", "costs", "cost", "После does — cost."),
        ]),
      ],
    },
    {
      id: "be-do", nav: "to be или do?", eyebrow: "Тема 3 · главное различие", title: "Is he at home? или Does he work?",
      theory: html(
        p("Самое важное в этом уроке. В английском два типа предложений, и вопросы в них строятся по-разному."),
        compare(
          ["am · is · are", "Глагола-действия нет. to be не переводится: «он (есть) дома».", "He is at home. · He isn't at home. · Is he at home?"],
          ["do · does", "Есть глагол-действие: работать, жить, любить.", "He works. · He doesn't work. · Does he work?"]
        ),
        h3("Как выбрать"),
        table(["После «кто» идёт…", "Нужно", "Пример"], [
          ["какой? (прилагательное)", "<mark>am / is / are</mark>", "Are you tired? · She isn't happy."],
          ["где? (место)", "<mark>am / is / are</mark>", "Where are you? — I'm at home."],
          ["кто? (профессия, имя)", "<mark>am / is / are</mark>", "Is he a doctor?"],
          ["возраст", "<mark>am / is / are</mark>", "How old are you?"],
          ["интересуется", "<mark>am / is / are</mark>", "Are you interested in football?"],
          ["действие (глагол)", "<mark>do / does</mark>", "Do you like football? · Where does he work?"],
        ]),
        examples([
          ["Сколько ей лет?", "How old <mark>is</mark> she?", "возраст → is"],
          ["Где он работает?", "Where <mark>does</mark> he work?", "work — действие → does"],
          ["Кто твой любимый актёр?", "<mark>Who is</mark> your favourite actor?", "о человеке — Who"],
          ["Какая твоя любимая еда?", "<mark>What is</mark> your favourite food?"],
          ["Как часто ты бываешь дома?", "How often <mark>are</mark> you at home?", "at home — место → are"],
        ]),
        pit(
          `Не смешивайте: ${no("Do you are tired?")} ${no("Are you like pizza?")} ${yes("Are you tired?")} ${yes("Do you like pizza?")}`,
          `«Я согласен» — это действие: ${no("I am agree.")} ${yes("I agree.")}`,
          `О человеке спрашиваем Who: ${no("What is your favourite actor?")} ${yes("Who is your favourite actor?")}`
        ),
        sticky("to be — глагол без перевода, связка в предложении: I am at home / He is a doctor / Is he a good man? · I work / I don't work / Does he work? · to be (am is are) — нет переводящегося глагола")
      ),
      groups: [
        group("am / is / are или do / does? (как в домашнем задании)", [
          ch("I ___ in a café now.", ["am", "do"], "am", "в кафе — место → am."),
          ch("___ she play tennis every week?", ["Is", "Does"], "Does", "play — действие → Does."),
          ch("___ she a singer?", ["Is", "Does"], "Is", "singer — кто → Is."),
          ch("___ they on the bus?", ["Are", "Do"], "Are", "on the bus — место → Are."),
          ch("Why ___ he in France?", ["is", "does"], "is", "in France — место → is."),
          ch("It ___ cold today.", ["isn't", "doesn't"], "isn't", "cold — какой → isn't."),
          ch("They ___ like animals.", ["aren't", "don't"], "don't", "like — действие → don't."),
          ch("Where ___ you? — I'm at home.", ["are", "do"], "are", "где ты → are."),
          ch("What ___ the dog eat?", ["is", "does"], "does", "eat — действие → does."),
          ch("He ___ an accountant.", ["isn't", "doesn't"], "isn't", "accountant — профессия → isn't."),
          ch("___ you interested in football?", ["Are", "Do"], "Are", "interested — какой → Are."),
          ch("We ___ make too much noise at night.", ["aren't", "don't"], "don't", "make — действие → don't."),
        ]),
        group("Выберите правильный вопрос", [
          ch("«Кто твой любимый актёр?»", ["Who is your favourite actor?", "What is your favourite actor?", "Who does your favourite actor?"], "Who is your favourite actor?", "О человеке — Who, актёр — «кто» → is."),
          ch("«Сколько тебе лет?»", ["How old are you?", "How old do you have?", "How many years do you have?"], "How old are you?", "Возраст — через to be."),
          ch("«Ты согласен?»", ["Do you agree?", "Are you agree?", "Do you are agree?"], "Do you agree?", "agree — глагол-действие → Do."),
        ]),
        group("Нажмите на неправильное слово", [
          fix("Are you like pizza?", "Are", "Do", "like — действие → Do you like…?"),
          fix("Do you tired today?", "Do", "Are", "tired — какой → Are you tired?"),
          fix("Where do your parents from?", "do", "are", "from — откуда (to be): Where are your parents from?"),
          fix("Do your sister like football?", "Do", "Does", "sister = she → Does your sister like…?"),
        ]),
      ],
    },
    {
      id: "free", nav: "play · listen · watch · go", eyebrow: "Тема 4 · лексика", title: "Свободное время: play, listen to, watch, go",
      theory: html(
        p("Слова из урока «Going out». Главное — какой глагол с каким словом."),
        table(["Глагол", "С чем", "Перевод"], [
          ["<mark>play</mark>", "video games · games online · the piano · the guitar", "играть в видеоигры · играть на пианино / гитаре"],
          ["<mark>listen to</mark>", "music · the radio · a song", "слушать музыку / радио / песню"],
          ["<mark>watch</mark>", "TV · a TV programme · a film · a video online · a football match", "смотреть телевизор / передачу / фильм / видео / матч"],
          ["<mark>go to</mark>", "the cinema · a concert · the theatre", "ходить в кино / на концерт / в театр"],
          ["<mark>go</mark>", "out · dancing · shopping", "выходить куда-то · ходить на танцы · по магазинам"],
        ]),
        h3("На что обратить внимание"),
        examples([
          ["Я слушаю музыку в машине.", "I <mark>listen to</mark> music in the car.", "listen всегда с to"],
          ["Он играет на гитаре.", "He plays <mark>the</mark> guitar.", "перед музыкальным инструментом — the"],
          ["Я смотрю матч по телевизору.", "I watch a football match <mark>on</mark> TV.", "on TV — по телевизору"],
          ["Давай сходим в музей.", "Let's <mark>visit a museum</mark> / <mark>go to a museum</mark>."],
        ]),
        pit(
          `${no("I listen music.")} ${yes("I listen to music.")}`,
          `${no("I play piano.")} ${yes("I play the piano.")}`,
          `Смотреть фильм — watch, а не see: ${no("I see TV.")} ${yes("I watch TV.")}`
        ),
        sticky("play video games / games online / the piano or guitar · listen to music / the radio / a song · watch TV / a film / a video online / a football match · go to the cinema / a concert / the theatre · visit a museum / go to a museum")
      ),
      groups: [
        group("Выберите глагол (как в домашнем задании)", [
          ch("How often do you ___ football on TV?", ["watch", "see", "listen"], "watch", "watch football on TV."),
          ch("I always ___ music in the car.", ["listen", "listen to", "watch"], "listen to", "listen to music."),
          ch("I try to ___ a museum once a month.", ["visit", "watch", "play"], "visit", "visit a museum."),
          ch("She ___ games online.", ["plays", "watches", "goes"], "plays", "play games online."),
          ch("Let's ___ the theatre tonight.", ["go to", "go", "visit to"], "go to", "go to the theatre."),
          ch("Do you ever ___ videos online?", ["watch", "listen to", "go"], "watch", "watch videos online."),
          ch("John and Gina ___ the cinema every weekend.", ["go to", "watch", "play"], "go to", "go to the cinema."),
        ]),
        group("Какое слово лишнее?", [
          ch("play: video games / the guitar / ___ / games online", ["the radio", "the piano"], "the radio", "the radio — listen to, а не play."),
          ch("listen to: the radio / a song / ___", ["music", "TV"], "music", "TV — watch."),
          ch("watch: TV / a film / ___", ["a football match", "the piano"], "a football match", "the piano — play."),
          ch("go to: the cinema / a concert / ___", ["the theatre", "a song"], "the theatre", "a song — listen to."),
        ]),
      ],
    },
    {
      id: "words", nav: "Фразы с доски", eyebrow: "Тема 5 · фразы со стикеров", title: "much, many и другие фразы с доски",
      theory: html(
        h3("much или many"),
        table(["", "many", "much"], [
          ["С чем", "то, что можно посчитать", "то, что нельзя посчитать"],
          ["Примеры", "many apples · many friends · many times", "much sugar · much time · much money"],
          ["Вопрос", "<mark>How many</mark> apples?", "<mark>How much</mark> sugar? · How much is it?"],
        ]),
        p("В утверждениях чаще говорят <b>a lot of</b> — подходит к обоим: a lot of apples, a lot of time."),
        h3("Полезные фразы"),
        examples([
          ["Мне это трудно.", "I <mark>find it difficult</mark>.", "find it + прилагательное"],
          ["Не думаю, что ты прав.", "I <mark>don't think</mark> you're right.", "отрицание — в think"],
          ["Не волнуйся, будь счастлив.", "<mark>Don't worry</mark>, be happy.", "просьба: Don't + глагол"],
          ["например", "<mark>e.g.</mark> = for example", "e.g. go to a restaurant, the cinema…"],
          ["и так далее", "<mark>etc.</mark> = et cetera", "books, films, music etc."],
          ["гулять с кем-то", "to walk <mark>with</mark> somebody"],
        ]),
        pit(
          `${no("How much apples?")} ${yes("How many apples?")}`,
          `«Я не думаю, что…» — отрицание в think: ${no("I think you aren't right.")} ${yes("I don't think you're right.")}`,
          `${no("I find difficult it.")} ${yes("I find it difficult.")}`
        ),
        sticky("many apples / much sugar · I find it difficult · I don't think you are right · e.g. = for example · etc. = et cetera · don't worry, be happy · Don't you forget it?")
      ),
      groups: [
        group("Выберите правильный вариант", [
          ch("How ___ brothers have you got?", ["much", "many"], "many", "brothers можно посчитать → many."),
          ch("How ___ is this painting?", ["much", "many"], "much", "Цена → How much."),
          ch("I don't drink ___ tea.", ["much", "many"], "much", "tea нельзя посчитать → much."),
          ch("She hasn't got ___ friends here.", ["much", "many"], "many", "friends → many."),
          ch("«Мне это трудно.»", ["I find it difficult.", "I find difficult it.", "It finds me difficult."], "I find it difficult.", "find it + difficult."),
          ch("«Не думаю, что это правда.»", ["I don't think it's true.", "I think it isn't true.", "I not think it's true."], "I don't think it's true.", "Отрицание — в think."),
          ch("«e.g.» значит ___", ["for example", "and so on", "everything"], "for example", "e.g. = for example, например."),
        ]),
      ],
    },
    {
      id: "final", nav: "Итоговый тест", eyebrow: "Итоговый тест · уроки 4–6", title: "Проверьте себя",
      theory: p("Задания по всему Present Simple и вопросам. Если ошибётесь, вернитесь к объяснению через меню сверху или откройте уроки 4 и 5."),
      groups: [
        group("Смешанные задания (как в домашнем задании)", [
          inp("(he / drive to work every day)", ["Does he drive to work every day?"], "Урок 6, тема 2: Does + he + drive…?", "Составьте вопрос"),
          inp("(you / have enough time?)", ["Do you have enough time?", "Have you got enough time?"], "Тема 1: Do + you + have…?", "Составьте вопрос"),
          inp("(I / eat cereal in the morning)", ["I eat cereal in the morning."], "Урок 4: I + eat…", "Составьте утверждение"),
          inp("(he / not / read the newspaper)", ["He doesn't read the newspaper.", "He does not read the newspaper."], "Урок 5: doesn't + read.", "Составьте отрицание"),
          ch("___ she dance often?", ["Does", "Is", "Do"], "Does", "Тема 1: she + dance → Does."),
          ch("What ___ you do at the weekend?", ["do", "are", "does"], "do", "Тема 2: What + do + you + do?"),
          ch("How ___ he travel to work?", ["does", "is", "do"], "does", "Тема 2: How + does + he + travel?"),
          inp("(they / not / like vegetables)", ["They don't like vegetables.", "They do not like vegetables."], "Урок 4: don't + like.", "Составьте отрицание"),
          inp("(she / catch a cold every winter)", ["She catches a cold every winter."], "Урок 5: catch → catches.", "Составьте утверждение"),
          ch("___ you at home now?", ["Are", "Do"], "Are", "Тема 3: at home — место → Are."),
          fix("Where does Harry studies?", "studies", "study", "Тема 2: после does — study."),
          ch("I ___ music on the radio.", ["listen to", "listen", "watch"], "listen to", "Тема 4: listen to."),
          ord("How often does she go to the gym?", "Тема 2: How often + does + she + go…?"),
          ch("How ___ sugar do you want?", ["many", "much"], "much", "Тема 5: sugar → much."),
        ]),
      ],
    },
  ],
};

// Added after a second check of the board: the student's sentences from «Going out».
extend(lesson, "words", html(
  h3("Ваши предложения с доски — как сказать естественнее"),
  table(["Как написано на доске", "Как сказать лучше", "Почему"], [
    ["It is not interesting for me to walk with somebody.", "<mark>I don't like</mark> walking with other people.", "«мне неинтересно» проще через don't like / find it boring"],
    ["I don't go to the cinema because there are no movies.", "I don't go to the cinema because there <mark>are no good films on</mark>.", "фильмы в кино есть, нет хороших: good films; on — идут в прокате"],
    ["Don't you forget it?", "<mark>Don't forget it!</mark>", "просьба — просто Don't + глагол, без you и без вопроса"],
  ]),
  examples([
    ["Ты настоящий домосед.", "You're a <mark>true home lover</mark>.", "в квизе «Do you prefer the quiet life?»; ещё говорят a homebody"],
    ["Сегодня туманно.", "It's <mark>foggy</mark> today.", "fog — туман, foggy — туманный; погода — через It is"],
  ]),
  sticky("It is not interesting for me to walk with somebody · I don't go to the cinema because there are no movies · Don't you forget it? · you are a true home lover · (it / be) foggy")
), group("Ваши фразы", [
  ch("«Мне неинтересно гулять с кем-то.»", ["I don't like walking with other people.", "It is not interesting for me walking with somebody.", "I am not interesting to walk."], "I don't like walking with other people.", "Проще и естественнее: I don't like walking…", { "I am not interesting to walk.": "I am not interesting — «я неинтересный»." }),
  ch("«Не забудь!»", ["Don't forget!", "Don't you forget?", "Not forget!"], "Don't forget!", "Просьба: Don't + глагол."),
  ch("«Сегодня туман.»", ["It's foggy today.", "Is foggy today.", "It foggy today."], "It's foggy today.", "Погода — It is + foggy."),
  ch("She never goes out. She's a real ___.", ["home lover", "house love", "home loving"], "home lover", "a home lover — домосед."),
]));

export default lesson;
