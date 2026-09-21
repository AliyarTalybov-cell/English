// Lesson 1 was written as JSON (1-to-be.base.json). New topics are added here, before the final test,
// so existing item ids and students' progress stay the same.
import { readFileSync } from "node:fs";
import { ch, inp, fix, ord, group, formula, table, examples, pit, no, yes, sticky, h3, p, compare, ng, html } from "./_helpers.mjs";

const base = JSON.parse(readFileSync(new URL("./1-to-be.base.json", import.meta.url), "utf8"));

const intro = {
  id: "intro", nav: "Знакомство", eyebrow: "Тема 11 · о себе", title: "Знакомство: Nice to meet you",
  theory: html(
    p("Как представиться и рассказать о себе — из урока «People and places» (упражнение «представьтесь на конференции») и из профиля «Friendly Face»."),
    h3("Представиться"),
    examples([
      ["Привет, я Лена.", "Hi, <mark>I'm</mark> Lena. / <mark>My name's</mark> Lena.", "My name's = My name is"],
      ["Как тебя зовут?", "<mark>What's your name?</mark>"],
      ["Приятно познакомиться.", "<mark>Nice to meet you.</mark>", "ответ: Nice to meet you, too."],
      ["Это Мелани.", "<mark>This is</mark> Melanie.", "так знакомят с кем-то"],
      ["Какая у тебя фамилия?", "What's your <mark>surname</mark>? / your <mark>second name</mark>?"],
    ]),
    h3("to meet и to get acquainted"),
    p("«Знакомиться» в разговоре — <b>to meet</b>: Nice to meet you, We met at work. <b>to get acquainted</b> — книжное «познакомиться поближе», в речи звучит редко."),
    h3("Откуда вы и кто по национальности"),
    compare(
      ["I'm from Russia.", "Я из России.", "from + страна"],
      ["I'm Russian.", "Я русский / россиянин.", "национальность, с большой буквы"]
    ),
    pit(
      `После from — только страна: ${no("I'm from Russian.")} ${yes("I'm from Russia.")}`,
      `Национальность — с большой буквы и без from: ${no("I'm russian.")} ${yes("I'm Russian.")}`
    ),
    h3("Хобби, чувства, любимое"),
    table(["Слово", "Пример"], [
      ["<mark>hobbies</mark> — хобби, увлечения", "My hobbies are tennis and reading."],
      ["<mark>feelings</mark> — чувства: happy, tired, bored, sad", "How are you feeling today? — I'm a bit tired."],
      ["<mark>favourite</mark> — любимый", "My favourite month is May."],
    ]),
    pit(
      `«У меня не так много хобби»: ${no("I have not so many hobbies.")} ${yes("I don't have many hobbies.")}`,
      `«У меня много событий»: ${yes("I have a lot of events.")} — правильно, а в значении «много дел» чаще говорят ${yes("I'm very busy.")}`
    ),
    h3("Ваши вопросы с доски"),
    examples([
      ["В каком ты классе / группе?", "<mark>What class are you in?</mark>", "предлог in — в конце"],
      ["Почему ты в этом классе?", "<mark>Why are you in this class?</mark>"],
      ["Какой твой любимый месяц?", "<mark>What's your favourite month?</mark>"],
      ["Тебе интересна фотография?", "<mark>Are you interested in photography?</mark>", "photography — фотография (занятие), photographer — фотограф"],
    ]),
    sticky("to get acquainted / to meet · = I am Russian · I have not so many hobbies · I have a lot of events / feelings · What class are you in? · Why are you in this class? · What is your second name? · What's your favorite month?")
  ),
  groups: [
    group("Выберите правильный вариант", [
      ch("A: Hi, I'm Nick. B: Hi, Nick. ___", ["Nice to meet you.", "Nice to meeting you.", "Nice meet you."], "Nice to meet you.", "Устойчивая фраза: Nice to meet you."),
      ch("___ is my friend Anna.", ["This", "He", "It's"], "This", "Знакомим с кем-то: This is…"),
      ch("«Я россиянка.»", ["I'm Russian.", "I'm from Russian.", "I'm Russia."], "I'm Russian.", "Национальность без from.", { "I'm from Russian.": "После from — страна: I'm from Russia.", "I'm Russia.": "Russia — страна. Национальность — Russian." }),
      ch("«Я из России.»", ["I'm from Russia.", "I'm from Russian.", "I from Russia."], "I'm from Russia.", "from + страна, и не забываем am."),
      ch("«У меня не так много хобби.»", ["I don't have many hobbies.", "I have not so many hobbies.", "I am not many hobbies."], "I don't have many hobbies.", "don't have many."),
      ch("«Мой любимый цвет — синий.»", ["My favourite colour is blue.", "My loved colour is blue.", "My favourite colour blue."], "My favourite colour is blue.", "favourite — любимый, и нужен is."),
      ch("What class ___ you in?", ["are", "do", "is"], "are", "you → are, предлог in в конце."),
      ch("I'm interested in ___. I love taking pictures.", ["photography", "photographer", "photo"], "photography", "Занятие — photography."),
    ]),
    group("Переведите на английский", [
      inp("«Как тебя зовут?»", ["What's your name?", "What is your name?"], "What + is + your name?", "Переведите на английский"),
      inp("«Приятно познакомиться.»", ["Nice to meet you.", "Nice to meet you too."], "Nice to meet you.", "Переведите на английский"),
      inp("«Я русский.»", ["I'm Russian.", "I am Russian."], "I'm + Russian (с большой буквы).", "Переведите на английский"),
      inp("«Почему ты в этом классе?»", ["Why are you in this class?"], "Why + are + you + in this class?", "Переведите на английский"),
    ]),
    group("Соберите вопрос", [
      ord("What class are you in?", "What class + are + you + in?"),
      ord("What is your favourite month?", "What + is + your favourite month?"),
      ord("Are you interested in photography?", "Are + you + interested in + photography?"),
    ]),
  ],
};

const words2 = {
  id: "words2", nav: "Фразы с доски 2", eyebrow: "Тема 12 · ещё фразы со стикеров", title: "Фразы с ваших стикеров, часть 2",
  theory: html(
    h3("Где находится: above, below, in the middle…"),
    table(["Фраза", "Значение"], [
      ["above / below", "над / под"],
      ["in the middle / in the centre", "посередине / в центре"],
      ["on the left / on the right", "слева / справа"],
    ]),
    examples([
      ["Анна на фото в центре.", "Anna is <mark>in the middle</mark> of the photo."],
      ["Мой дом справа.", "My house is <mark>on the right</mark>."],
    ]),
    pit(`С left и right нужны on the: ${no("My house is right.")} ${yes("My house is on the right.")}`),
    h3("time — «время» и «раз»"),
    table(["Значение", "Как сказать", "Пример"], [
      ["время (нельзя посчитать)", "time — без a и без -s", "I haven't got <mark>time</mark>."],
      ["раз (можно посчитать)", "a time · times", "It isn't our first <mark>time</mark> here. · three <mark>times</mark> a week"],
    ]),
    h3("hundred — сто"),
    p("<b>a hundred / one hundred</b> — сто. После числа <b>без -s</b>: two <b>hundred</b>, five hundred. Между сотнями и десятками — <b>and</b>: 125 = one hundred <b>and</b> twenty-five."),
    pit(`${no("two hundreds")} ${yes("two hundred")}`),
    h3("Первый день, второй курс"),
    examples([
      ["У него сегодня первый день здесь.", "<mark>It is his first day</mark> here."],
      ["Она студентка второго курса.", "She's a <mark>second-year student</mark>.", "как two-year, 15-minute: через дефис, без -s"],
      ["Всё, на этом всё.", "<mark>That's it.</mark>", "That is it — вот и всё / именно так"],
    ]),
    h3("present / absent, ill / sick"),
    examples([
      ["Все присутствуют?", "Is everybody <mark>present</mark>?", "to be present — присутствовать"],
      ["Мои коллеги отсутствуют на работе.", "My colleagues <mark>are absent</mark> from work.", "to be absent from"],
      ["Я болею сегодня.", "I'm <mark>ill</mark> today. / I'm <mark>sick</mark> today.", "ill — брит., sick — амер., смысл один"],
      ["Меня тошнит.", "I feel <mark>sick</mark>.", "в британском feel sick — именно «тошнит»"],
    ]),
    h3("to be going to — собираться"),
    formula("кто", "!am · is · are going to", "глагол"),
    examples([
      ["Мы собираемся прочитать статью.", "We <mark>are going to</mark> read the article."],
      ["Я собираюсь позвонить маме.", "I<mark>'m going to</mark> call my mum."],
    ]),
    h3("Ещё фразы"),
    examples([
      ["Надеюсь, всё получится.", "I hope it will <mark>work out</mark>.", "work out — получиться, наладиться (а ещё — тренироваться)"],
      ["Моя ошибка! / Виноват.", "<mark>My bad!</mark>", "разговорное"],
      ["Нам нужно принять решение.", "We need to <mark>make a decision</mark>.", "take a decision — тоже верно, чаще в британском"],
      ["брови · ресницы", "<mark>eyebrows</mark> · <mark>eyelashes</mark>"],
      ["Я тебе не вру.", "I don't <mark>lie</mark> to you."],
    ]),
    h3("Слова на -tion"),
    p("Окончание <b>-tion</b> читается «шн», ударение — на слог перед ним: ambi<b>TION</b> → am<b>BI</b>tion."),
    table(["Слово", "Перевод"], [
      ["ambition", "амбиция, стремление"], ["condition", "условие, состояние"], ["competition", "соревнование, конкуренция"], ["exception", "исключение"],
    ]),
    sticky("above / below / in the center / in the middle / left / right · that's it · It is his first day here · second year student · to work out / I hope it will work out · time — время / раз · hundred · eyebrows / eyelashes · WE are going to · to be present / to be absent · to be ill / to be sick · We need to take a decision · My bad · ambition / condition / competition / exception")
  ),
  groups: [
    group("Выберите правильный вариант", [
      ch("The picture is ___ the sofa.", ["above", "on the right", "in the middle"], "above", "над диваном → above."),
      ch("The bank is ___, next to the café.", ["on the left", "left", "in left"], "on the left", "on the left — слева."),
      ch("«У меня нет времени.»", ["I haven't got time.", "I haven't got a time.", "I haven't got times."], "I haven't got time.", "Время — без a и -s."),
      ch("I go to the gym three ___ a week.", ["time", "times", "hours"], "times", "раз → times."),
      ch("300 — three ___", ["hundred", "hundreds", "hundred of"], "hundred", "После числа — hundred без -s."),
      ch("She's a ___ student.", ["second-year", "second-years", "second year's"], "second-year", "Через дефис, без -s."),
      ch("My partner is ___ from work today.", ["absent", "present", "ill"], "absent", "absent from work — отсутствует на работе."),
      ch("We ___ going to visit my parents.", ["are", "do", "—"], "are", "be going to: we are going to."),
      ch("Don't worry, I'm sure it will ___.", ["work out", "work up", "go out"], "work out", "work out — получится."),
      ch("«Нам нужно принять решение.»", ["We need to make a decision.", "We need to do a decision.", "We need to accept a decision."], "We need to make a decision.", "make (или take) a decision."),
      ch("«брови» — ___", ["eyebrows", "eyelashes", "eyes"], "eyebrows", "eyebrows — брови, eyelashes — ресницы."),
      ch("«исключение» — ___", ["exception", "condition", "ambition"], "exception", "exception — исключение."),
    ]),
    group("Напишите", [
      inp("125 →", ["one hundred and twenty-five", "a hundred and twenty-five", "one hundred and twenty five", "a hundred and twenty five"], "hundred + and + twenty-five.", "Напишите число словами", "one hundred and…"),
      inp("I / going to / call my mum", ["I'm going to call my mum.", "I am going to call my mum."], "I + am + going to + call…", "Составьте предложение"),
    ]),
    group("Нажмите на неправильное слово", [
      fix("My house is right.", "right", "on the right", "Слева / справа — on the left / on the right."),
      fix("Five hundreds people came.", "hundreds", "hundred", "После числа — hundred."),
      fix("We is going to read the article.", "is", "are", "we → are going to."),
    ]),
  ],
};

const sections = base.sections.slice();
sections.splice(sections.findIndex(s => s.id === "final"), 0, intro, words2);

export default {
  slug: base.slug,
  title: base.title,
  subtitle: base.subtitle + ", знакомство, фразы с доски",
  position: 1,
  sections,
};
