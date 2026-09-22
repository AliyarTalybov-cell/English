import { ch, inp, fix, ord, group, formula, table, examples, pit, no, yes, sticky, h3, p, compare, ng, html, extend } from "./_helpers.mjs";
import { addTranslation } from "./translate.mjs";

const lesson = {
  slug: "present-simple-he-she-it",
  title: "Present Simple: he, she, it",
  subtitle: "окончание -s / -es, doesn't и does, распорядок дня, профессии, числа",
  position: 5,
  sections: [
    {
      id: "plus", nav: "she works", eyebrow: "Тема 1 · утверждение", title: "He works, she watches — окончание -s",
      theory: html(
        p("С <b>he, she, it</b> (и с любым одним человеком или предметом: Anna, my brother, the shop) к глаголу добавляется <b>-s</b>. Это единственное, что меняется."),
        formula("he · she · it", "!глагол + s / es", "остальное"),
        compare(
          ["I work at night.", "Я работаю ночью.", "I / you / we / they → work"],
          ["Liam works at night.", "Лиам работает ночью.", "he / she / it → works"]
        ),
        h3("Как добавлять -s"),
        table(["Глагол кончается на…", "Что делаем", "Примеры"], [
          ["почти все глаголы", "+ <mark>s</mark>", "work → works · play → plays · get → gets"],
          ["-ch, -sh, -s, -x, -z, -o", "+ <mark>es</mark>", "watch → watches · finish → finishes · go → goes · do → does"],
          ["согласная + y", "y → <mark>ies</mark>", "study → studies · carry → carries · worry → worries"],
          ["гласная + y", "просто + s", "play → plays · say → says"],
          ["have", "особая форма", "have → <mark>has</mark>"],
        ]),
        examples([
          ["Кира встаёт в 2 часа ночи.", "Keira <mark>gets</mark> up at 2 a.m."],
          ["Мой брат смотрит телевизор по вечерам.", "My brother <mark>watches</mark> TV in the evening.", "ch → es"],
          ["Он заканчивает работу в 7 утра.", "He <mark>finishes</mark> work at 7 a.m.", "sh → es"],
          ["Она учит экономику.", "She <mark>studies</mark> economics.", "y → ies"],
          ["Джон принимает душ каждый вечер.", "John <mark>has</mark> a shower every evening.", "have → has"],
        ]),
        pit(
          `Не забывайте -s: ${no("She like pizza.")} ${yes("She likes pizza.")}`,
          `-s только у глагола, не у всех слов подряд: ${no("She likes pizzas very muchs.")} ${yes("She likes pizza very much.")}`,
          `have → has, а не haves: ${no("He haves lunch at 1.")} ${yes("He has lunch at 1.")}`
        ),
        sticky("Present Simple · He / she / it · V + s / es · She likes food · play — He plays · have — he has · ch, sh, s, o, z, x + es: teaches · study — studies")
      ),
      groups: [
        group("Выберите правильную форму", [
          ch("My sister ___ in a hospital.", ["work", "works"], "works", "sister = she → works."),
          ch("They ___ in a big house.", ["live", "lives"], "live", "they → без -s."),
          ch("Liam ___ his job.", ["love", "loves"], "loves", "Liam = he → loves."),
          ch("The film ___ at 8 p.m.", ["start", "starts"], "starts", "film = it → starts."),
          ch("My parents ___ TV every evening.", ["watch", "watches"], "watch", "parents = they → watch."),
          ch("Tom ___ lunch at work.", ["have", "has", "haves"], "has", "he → has."),
        ]),
        group("Напишите форму для he / she / it", [
          inp("watch →", ["watches"], "ch → + es.", "Напишите глагол с окончанием", "Кончается на ch."),
          inp("go →", ["goes"], "o → + es.", "Напишите глагол с окончанием", "Кончается на o."),
          inp("study →", ["studies"], "согласная + y → ies.", "Напишите глагол с окончанием", "y меняется."),
          inp("play →", ["plays"], "гласная + y → просто s.", "Напишите глагол с окончанием", "a перед y — гласная."),
          inp("finish →", ["finishes"], "sh → + es.", "Напишите глагол с окончанием", "Кончается на sh."),
          inp("carry →", ["carries"], "согласная + y → ies.", "Напишите глагол с окончанием", "r перед y — согласная."),
          inp("do →", ["does"], "o → + es.", "Напишите глагол с окончанием", "Кончается на o."),
          inp("have →", ["has"], "Особая форма.", "Напишите глагол с окончанием", "Не haves."),
        ]),
        group("Нажмите на неправильное слово (как в домашнем задании)", [
          fix("Sara watch TV every evening.", "watch", "watches", "Sara = she → watches."),
          fix("He carrys a big bag with him at work.", "carrys", "carries", "согласная + y → carries."),
          fix("Sheena love her job.", "love", "loves", "Sheena = she → loves."),
          fix("My dad gos to work by bus.", "gos", "goes", "go → goes."),
        ]),
      ],
    },
    {
      id: "neg", nav: "doesn't · does", eyebrow: "Тема 2 · отрицание и вопрос", title: "She doesn't work. Does she work?",
      theory: html(
        p("В отрицании и вопросе с he / she / it появляется <b>does</b>. Окончание -s <b>переходит на does</b>, а глагол возвращается в словарную форму."),
        table(["", "I / you / we / they", "he / she / it"], [
          ["+", "I work.", "She work<mark>s</mark>."],
          ["−", "I <mark>don't</mark> work.", "She <mark>doesn't</mark> work."],
          ["?", "<mark>Do</mark> you work?", "<mark>Does</mark> she work?"],
          ["Да", "Yes, I do.", "Yes, she does."],
          ["Нет", "No, I don't.", "No, she doesn't."],
        ]),
        examples([
          ["Лиам не обедает.", "Liam <mark>doesn't have</mark> lunch.", "не doesn't has"],
          ["Ей не нравится её работа.", "She <mark>doesn't like</mark> her job.", "не doesn't likes"],
          ["Он ходит в спортзал?", "<mark>Does</mark> he <mark>go</mark> to the gym?", "не Does he goes"],
        ]),
        p("Правило простое: <b>-s</b> в предложении ставится <b>один раз</b>. Если уже есть does / doesn't, у глагола -s нет."),
        pit(
          `${no("She doesn't likes people.")} ${yes("She doesn't like people.")}`,
          `${no("Does she likes food?")} ${yes("Does she like food?")}`,
          `С he / she / it — doesn't, а не don't: ${no("Paulo don't have breakfast.")} ${yes("Paulo doesn't have breakfast.")}`
        ),
        sticky("(−?) does · She doesn't like food · Does she like food? · yes, he does / no, he doesn't · I work / I don't work / he doesn't work / Does he work?")
      ),
      groups: [
        group("Выберите правильную форму", [
          ch("My brother ___ coffee.", ["don't drink", "doesn't drink", "doesn't drinks"], "doesn't drink", "he → doesn't + drink (без -s).", { "don't drink": "brother = he → doesn't.", "doesn't drinks": "-s уже ушла в doesn't, у drink её нет." }),
          ch("___ your sister live in London?", ["Do", "Does", "Is"], "Does", "sister = she → Does."),
          ch("Does he work at night? — Yes, he ___.", ["does", "do", "works"], "does", "Yes, he does."),
          ch("Does Anna like cats? — No, she ___.", ["don't", "doesn't", "isn't"], "doesn't", "No, she doesn't."),
          ch("Chiara ___ to the gym.", ["doesn't go", "doesn't goes", "don't go"], "doesn't go", "doesn't + go."),
          ch("Does he ___ a car?", ["have", "has", "haves"], "have", "После Does — have."),
        ]),
        group("Сделайте отрицание", [
          inp("She gets up early in the morning.", ["She doesn't get up early in the morning.", "She does not get up early in the morning."], "gets → doesn't get.", "Сделайте отрицание"),
          inp("He plays video games.", ["He doesn't play video games.", "He does not play video games."], "plays → doesn't play.", "Сделайте отрицание"),
          inp("My mum has breakfast at work.", ["My mum doesn't have breakfast at work.", "My mum does not have breakfast at work."], "has → doesn't have.", "Сделайте отрицание"),
        ]),
        group("Задайте вопрос", [
          inp("She works in a hospital.", ["Does she work in a hospital?"], "Does + she + work…?", "Превратите в вопрос"),
          inp("He watches TV in the evening.", ["Does he watch TV in the evening?"], "Does + he + watch…?", "Превратите в вопрос"),
          inp("Your dad goes to bed early.", ["Does your dad go to bed early?"], "Does + your dad + go…?", "Превратите в вопрос"),
        ]),
        group("Нажмите на неправильное слово", [
          fix("She doesn't likes people.", "likes", "like", "После doesn't — like, без -s."),
          fix("Paulo don't have breakfast in the morning.", "don't", "doesn't", "Paulo = he → doesn't."),
          fix("Does she goes to work by bus?", "goes", "go", "После Does — go."),
        ]),
      ],
    },
    {
      id: "day", nav: "Распорядок дня", eyebrow: "Тема 3 · лексика", title: "Мой день: get up, have a shower, go to bed",
      theory: html(
        p("Слова из урока «A night's work». Это устойчивые сочетания, их учат целиком."),
        ng(
          ["Утро", ["wake up — просыпаться", "get up — вставать", "have a shower / a bath — принимать душ / ванну", "do my hair — делать причёску", "get dressed — одеваться", "get ready — собираться", "have breakfast — завтракать", "leave home — выходить из дома"]],
          ["День и вечер", ["go to work / school — идти на работу / в школу", "start work — начинать работу", "have lunch / dinner — обедать / ужинать", "finish work — заканчивать работу", "go to the gym — ходить в спортзал", "do exercise — делать зарядку, тренироваться", "get home — добираться домой", "go to bed — ложиться спать"]]
        ),
        h3("home без to"),
        table(["Фраза", "Значение"], [
          ["go <mark>home</mark>", "идти домой"],
          ["come <mark>home</mark>", "приходить домой"],
          ["get <mark>home</mark>", "добраться домой"],
        ]),
        p("Со словом <b>home</b> предлог <b>to</b> не ставят. Но: go <b>to</b> work, go <b>to</b> bed."),
        h3("get — одно слово, много значений"),
        examples([
          ["Я встаю в 7.", "I <mark>get up</mark> at 7.", "get up — вставать"],
          ["Я добираюсь до работы в 9.", "I <mark>get to</mark> work at 9.", "get to — добираться"],
          ["Я получил сообщение.", "I <mark>get</mark> a message.", "get — получать"],
          ["Понятно.", "I <mark>get it</mark>.", "get it — понять"],
        ]),
        pit(
          `Не «делаю завтрак», а «имею»: ${no("I do breakfast.")} ${no("I eat a shower.")} ${yes("I have breakfast.")} ${yes("I have a shower.")}`,
          `${no("I go to home.")} ${yes("I go home.")}`,
          `wake up — проснуться, get up — встать с кровати. Это разные вещи.`
        ),
        sticky("wake up · go home / come home / get home · get a message / get home / get to work / get it · like reading / want to go")
      ),
      groups: [
        group("Выберите глагол (как в домашнем задании)", [
          ch("I ___ a shower every morning.", ["have", "do", "make"], "have", "have a shower."),
          ch("Hayley ___ dressed in five minutes.", ["gets", "does", "makes"], "gets", "get dressed."),
          ch("I ___ my hair before work.", ["do", "have", "make"], "do", "do my hair."),
          ch("She ___ home at 8.30 in the morning.", ["leaves", "goes", "starts"], "leaves", "leave home — выходить из дома."),
          ch("We ___ exercise at the weekend.", ["do", "make", "go"], "do", "do exercise."),
          ch("John ___ dinner with his family at 9 p.m.", ["has", "does", "makes"], "has", "have dinner → has dinner."),
          ch("I ___ to bed early in the week.", ["go", "get", "leave"], "go", "go to bed."),
          ch("What time do you ___ home?", ["get", "go to", "leave to"], "get", "get home — без to."),
        ]),
        group("Какое предложение правильное?", [
          ch("«После работы я иду домой.»", ["I go home after work.", "I go to home after work.", "I go at home after work."], "I go home after work.", "home без to: go home."),
          ch("«Вечером я принимаю душ.»", ["I have a shower in the evening.", "I do a shower in the evening.", "I take shower in the evening."], "I have a shower in the evening.", "have a shower (можно take a shower, но с a)."),
          ch("«Она завтракает в 7.»", ["She has breakfast at 7.", "She does breakfast at 7.", "She eats a breakfast at 7."], "She has breakfast at 7.", "have breakfast → has breakfast, без a."),
        ]),
        group("Соберите предложение", [
          ord("Keira gets up at 2 a.m.", "Keira + gets up + at 2 a.m.", [], ["Keira"]),
          ord("She has a quick breakfast at work.", "She + has + a quick breakfast + at work."),
          ord("Liam goes straight to bed.", "Liam + goes + straight to bed.", [], ["Liam"]),
        ]),
      ],
    },
    {
      id: "jobs", nav: "Профессии", eyebrow: "Тема 4 · лексика", title: "What does she do? — She's a nurse.",
      theory: html(
        ng(
          ["Профессии из урока", ["doctor — врач", "nurse — медсестра, медбрат", "police officer — полицейский", "journalist — журналист", "photographer — фотограф", "musician — музыкант"]],
          ["И ещё", ["actor — актёр", "farmer — фермер", "cleaner — уборщик", "driver — водитель", "shop assistant — продавец", "tennis player — теннисист", "security guard — охранник"]]
        ),
        h3("Как спросить и ответить"),
        examples([
          ["Кем она работает?", "<mark>What does</mark> she <mark>do</mark>?", "дословно: что она делает?"],
          ["Она медсестра.", "She's <mark>a</mark> nurse.", "перед профессией — a"],
          ["Он работает диджеем.", "He <mark>works as a</mark> DJ.", "work as + a + профессия"],
          ["Я инженер.", "I'm <mark>an</mark> engineer.", "перед гласным звуком — an"],
        ]),
        h3("-er, -or, -ist: как образуются профессии"),
        table(["Действие", "+ окончание", "Профессия"], [
          ["drive — водить", "+ er", "driv<mark>er</mark>"],
          ["clean — убирать", "+ er", "clean<mark>er</mark>"],
          ["farm — ферма", "+ er", "farm<mark>er</mark>"],
          ["act — играть роль", "+ or", "act<mark>or</mark>"],
          ["journal — журнал", "+ ist", "journal<mark>ist</mark>"],
        ]),
        pit(
          `Перед профессией нужен a / an: ${no("She is doctor.")} ${yes("She is a doctor.")}`,
          `police — ${no("polica officer")} ${yes("police officer")}`,
          `What does she do? — это про работу. Ответ не «She does…», а ${yes("She's a nurse.")}`
        ),
        sticky("actor · farmer · tennis player · cleaner · doctor · shop assistant · musician · journalist · photographer · driver · nurse · police officer · to work as a DJ / to work as a doctor")
      ),
      groups: [
        group("Кто это?", [
          ch("He plays music in concerts. He's a ___.", ["musician", "journalist", "farmer"], "musician", "Играет музыку → musician."),
          ch("She sells things in a shop. She's a ___.", ["shop assistant", "cleaner", "nurse"], "shop assistant", "Работает в магазине → shop assistant."),
          ch("He takes photos. He's a ___.", ["photographer", "driver", "actor"], "photographer", "photo → photographer."),
          ch("She works in a hospital and helps doctors. She's a ___.", ["nurse", "police officer", "farmer"], "nurse", "Помогает врачам → nurse."),
          ch("He writes for a newspaper. He's a ___.", ["journalist", "musician", "cleaner"], "journalist", "Пишет в газету → journalist."),
          ch("She works in films and theatre. She's an ___.", ["actor", "driver", "doctor"], "actor", "an actor — actor начинается с гласной."),
        ]),
        group("Выберите правильный вариант", [
          ch("«Кем работает твой брат?»", ["What does your brother do?", "What is your brother do?", "Who does your brother work?"], "What does your brother do?", "What does + he + do?"),
          ch("«Она врач.»", ["She's a doctor.", "She's doctor.", "She does a doctor."], "She's a doctor.", "Перед профессией — a."),
          ch("«Он работает водителем.»", ["He works as a driver.", "He works a driver.", "He is work as driver."], "He works as a driver.", "work as + a + профессия."),
        ]),
        group("Напишите профессию", [
          inp("Он водит автобус. He's a ___.", ["driver"], "drive + r → driver.", "Впишите одно слово", "drive + …"),
          inp("Она работает на ферме. She's a ___.", ["farmer"], "farm + er.", "Впишите одно слово", "farm + …"),
          inp("Он убирает офисы. He's a ___.", ["cleaner"], "clean + er.", "Впишите одно слово", "clean + …"),
        ]),
      ],
    },
    {
      id: "numbers", nav: "Числа · текст", eyebrow: "Тема 5 · числа и чтение", title: "thirteen или thirty? И один день из жизни",
      theory: html(
        h3("-teen и -ty"),
        p("Числа 13–19 кончаются на <b>-teen</b>, ударение в конце: thir<b>TEEN</b>. Десятки кончаются на <b>-ty</b>, ударение в начале: <b>THIR</b>ty."),
        table(["-teen", "-ty"], [
          ["13 thir<mark>teen</mark>", "30 thir<mark>ty</mark>"],
          ["14 four<mark>teen</mark>", "40 for<mark>ty</mark> — без u!"],
          ["15 fif<mark>teen</mark>", "50 fif<mark>ty</mark>"],
          ["20 — twen<mark>ty</mark>", "21 twenty-one — через дефис"],
        ]),
        h3("Прочитайте текст"),
        p("<b>Ben</b> is a security guard. He works at night. He gets up at 7 p.m. and has a shower. Then he has dinner with his wife. He leaves home at 9.30 and gets to work at 10 p.m. He checks the building every hour. He doesn't have lunch, but he usually has a snack at 2 a.m. He finishes work at 6 a.m. and gets home at 7. His wife starts work at 8, so they have breakfast together. Then Ben goes straight to bed. He loves his job, but he doesn't see his friends very often."),
        pit(
          `forty пишется без u: ${no("fourty")} ${yes("forty")}`,
          `Числа от 21 до 99 — через дефис: ${yes("thirty-five")}`
        ),
        sticky("thirteen · twenty · thirty · forty · fifty · don't worry, be happy · She is here — host")
      ),
      groups: [
        group("Числа", [
          ch("40 — ___", ["fourty", "forty", "fourteen"], "forty", "40 = forty, без u."),
          ch("13 — ___", ["thirty", "thirteen", "threeteen"], "thirteen", "13 = thirteen."),
          ch("50 — ___", ["fifty", "fiveteen", "fifteen"], "fifty", "50 = fifty."),
          inp("35 →", ["thirty-five", "thirty five"], "thirty + five, через дефис.", "Напишите число словами", "thirty-…"),
          inp("20 →", ["twenty"], "20 = twenty.", "Напишите число словами", "Начинается на tw."),
        ]),
        group("По тексту про Бена: правда или нет?", [
          ch("Ben works at night.", ["True", "False"], "True", "He works at night."),
          ch("Ben has lunch at 2 a.m.", ["True", "False"], "False", "He doesn't have lunch, but he usually has a snack at 2 a.m."),
          ch("Ben and his wife have breakfast together.", ["True", "False"], "True", "His wife starts work at 8, so they have breakfast together."),
          ch("Ben sees his friends a lot.", ["True", "False"], "False", "He doesn't see his friends very often."),
          ch("What time does Ben get to work?", ["At 9.30 p.m.", "At 10 p.m.", "At 7 p.m."], "At 10 p.m.", "He gets to work at 10 p.m."),
        ]),
        group("Впишите глагол в правильной форме (как в домашнем задании)", [
          inp("Moyra ___ (get up) at 10 p.m.", ["gets up"], "Moyra = she → gets up.", "Впишите глагол"),
          inp("She ___ (not have) breakfast.", ["doesn't have", "does not have"], "she → doesn't have.", "Впишите глагол"),
          inp("She ___ (finish) work at 7 a.m.", ["finishes"], "sh → finishes.", "Впишите глагол"),
          inp("Her children ___ (start) school at 8.", ["start"], "children = they → start.", "Впишите глагол"),
          inp("She ___ (say) «good night» to them.", ["says"], "гласная + y → says.", "Впишите глагол"),
        ]),
      ],
    },
    {
      id: "final", nav: "Итоговый тест", eyebrow: "Итоговый тест · все темы вперемешку", title: "Проверьте себя",
      theory: p("Все темы урока вперемешку. Если ошибётесь, вернитесь к объяснению нужной темы через меню сверху."),
      groups: [
        group("Смешанные задания", [
          ch("My dad ___ the newspaper every morning.", ["read", "reads", "is read"], "reads", "Тема 1: dad = he → reads."),
          inp("teach →", ["teaches"], "Тема 1: ch → es.", "Напишите глагол для he / she / it", "Кончается на ch."),
          ch("She ___ meat.", ["don't eat", "doesn't eat", "doesn't eats"], "doesn't eat", "Тема 2: doesn't + eat."),
          fix("Does he plays the piano?", "plays", "play", "Тема 2: после Does — play."),
          ch("Does your sister live with you? — No, she ___.", ["doesn't", "don't", "isn't"], "doesn't", "Тема 2: No, she doesn't."),
          ch("I ___ home at 6 p.m.", ["get", "get to", "go to"], "get", "Тема 3: get home — без to."),
          ch("He ___ a shower after the gym.", ["has", "does", "makes"], "has", "Тема 3: have a shower → has."),
          ch("«Она учительница.»", ["She's a teacher.", "She's teacher.", "She teaches a teacher."], "She's a teacher.", "Тема 4: a перед профессией."),
          inp("your mum / what / do?", ["What does your mum do?"], "Тема 4: What + does + your mum + do?", "Составьте вопрос о профессии"),
          ch("40 — ___", ["forty", "fourty"], "forty", "Тема 5: без u."),
          ord("She doesn't work at the weekend.", "Тема 2: She + doesn't + work + at the weekend."),
          fix("Mark study economics at school.", "study", "studies", "Тема 1: y → ies."),
        ]),
      ],
    },
  ],
};

// Added after a second check of the board: how -s is pronounced (exercise 5 in «A night's work»).
extend(lesson, "plus", html(
  h3("Как читается окончание -s"),
  table(["Звук", "Когда", "Примеры"], [
    ["/s/ — «с»", "после глухих звуков: p, t, k, f", "starts · works · gets · sleeps"],
    ["/z/ — «з»", "после звонких и гласных", "goes · leaves · has · plays"],
    ["/ɪz/ — «из»", "после s, z, sh, ch, x, ge", "watches · finishes · uses · relaxes"],
  ]),
  p("Главное — слышать лишний слог в третьем случае: watch — <b>wat·ches</b> (два слога)."),
  sticky("He gets home at 7 a.m. · She doesn't go to bed late · She starts work at 9.30 · He leaves work early · She works at home · He has lunch at 1 p.m.", "Из учебника: послушайте -s")
), group("Сколько слогов в слове?", [
  ch("works — ___", ["1 слог", "2 слога"], "1 слог", "works /s/ — один слог."),
  ch("watches — ___", ["1 слог", "2 слога"], "2 слога", "wat·ches — /ɪz/ добавляет слог."),
  ch("finishes — ___", ["2 слога", "3 слога"], "3 слога", "fi·ni·shes — /ɪz/ добавляет слог."),
  ch("plays — ___", ["1 слог", "2 слога"], "1 слог", "plays /z/ — один слог."),
]));

// «Переведите с русского» goes last in every topic; add new groups below this line so item ids stay the same.
addTranslation(lesson);

export default lesson;
