import fs from "node:fs/promises";
import path from "node:path";

import { XMLParser } from "fast-xml-parser";


export type QuizMode =
  | "scored"
  | "result-set";

export type QuizDifficulty =
  | "easy"
  | "medium"
  | "hard";

export type QuizQuestionType =
  | "single"
  | "multiple"
  | "true-false";


export interface QuizResult {
  id: string;
  title: string;
  description: string;
}

export interface QuizScore {
  result: string;
  points: number;
}

export interface QuizAnswer {
  text: string;

  correct?: boolean;

  scores?: QuizScore[];
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  text: string;
  answers: QuizAnswer[];
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;

  difficulty?: QuizDifficulty;

  mode: QuizMode;

  questions: QuizQuestion[];

  results?: QuizResult[];
}


const quizDirectory = path.resolve(
  "src/data/quizzes"
);


const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  trimValues: true,
});


function asArray<T>(
  value: T | T[] | undefined
): T[] {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value)
    ? value
    : [value];
}


function parseBoolean(
  value: unknown
): boolean {
  return (
    value === true ||
    value === "true"
  );
}


function normalizeQuiz(
  rawQuiz: any,
  fallbackId: string
): Quiz {

  /*
   * Results
   */

  const rawResults =
    asArray(
      rawQuiz.results?.result
    );

  const results: QuizResult[] =
    rawResults.map(
      (result: any) => ({
        id: String(
          result.id ?? ""
        ),

        title: String(
          result.title ??
          result.id ??
          ""
        ),

        description: String(
          result.description ?? ""
        ),
      })
    );


  /*
   * Questions
   */

  const rawQuestions =
    asArray(
      rawQuiz.question
    );

  const questions: QuizQuestion[] =
    rawQuestions.map(
      (
        question: any,
        questionIndex: number
      ) => {

        const rawAnswers =
          asArray(
            question.answers?.answer
          );


        const answers: QuizAnswer[] =
          rawAnswers.map(
            (answer: any) => {

              /*
               * Simple text-only answer
               */

              if (
                typeof answer !== "object"
              ) {
                return {
                  text: String(answer),
                };
              }


              /*
               * Result-set scores
               */

              const rawScores =
                asArray(
                  answer.score
                );

              const scores: QuizScore[] =
                rawScores.map(
                  (score: any) => ({
                    result: String(
                      score.result ?? ""
                    ),

                    points: Number(
                      score.points ?? 0
                    ),
                  })
                );


              /*
               * Build answer
               */

              const normalizedAnswer:
                QuizAnswer = {

                text: String(
                  answer["#text"] ?? ""
                ),
              };


              /*
               * Scored quiz answer
               */

              if (
                answer.correct !==
                undefined
              ) {
                normalizedAnswer.correct =
                  parseBoolean(
                    answer.correct
                  );
              }


              /*
               * Result-set quiz answer
               */

              if (
                scores.length > 0
              ) {
                normalizedAnswer.scores =
                  scores;
              }


              return normalizedAnswer;
            }
          );


        return {
          id: String(
            question.id ??
            `question-${questionIndex + 1}`
          ),

          type:
            question.type as QuizQuestionType,

          text: String(
            question.text ?? ""
          ),

          answers,

          explanation:
            question.explanation
              ? String(
                  question.explanation
                )
              : undefined,
        };
      }
    );


  /*
   * Quiz mode
   */

  const mode: QuizMode =
    rawQuiz.mode === "result-set"
      ? "result-set"
      : "scored";


  /*
   * Difficulty
   */

  const difficulty =
    rawQuiz.difficulty ? ( rawQuiz.difficulty as QuizDifficulty ) : undefined;


  /*
   * Build quiz
   */

  return {
    id: String(
      rawQuiz.id ??
      fallbackId
    ),

    title: String(
      rawQuiz.title ??
      fallbackId
    ),

    description: String(
      rawQuiz.description ?? ""
    ),

    category: String(
      rawQuiz.category ??
      "General"
    ),

    difficulty,

    mode,

    questions,

    results: results.length > 0 ? results : undefined,
  };
}


export async function getQuiz(
  id: string
): Promise<Quiz> {

  const filePath = path.join(
    quizDirectory,
    `${id}.xml`
  );

  const xml =
    await fs.readFile(
      filePath,
      "utf-8"
    );

  const parsed =
    parser.parse(xml);


  if (!parsed.quiz) {
    throw new Error(
      `Quiz "${id}" does not contain a <quiz> root element.`
    );
  }


  return normalizeQuiz(
    parsed.quiz,
    id
  );
}


export async function getQuizzes():
  Promise<Quiz[]> {

  const files =
    await fs.readdir(
      quizDirectory
    );


  const quizFiles =
    files.filter(
      (file) =>
        file.endsWith(".xml")
    );


  const quizzes =
    await Promise.all(
      quizFiles.map(
        async (file) => {

          const id =
            file.replace(
              /\.xml$/,
              ""
            );


          return getQuiz(id);
        }
      )
    );


  return quizzes.sort(
    (a, b) =>
      a.title.localeCompare(
        b.title
      )
  );
}