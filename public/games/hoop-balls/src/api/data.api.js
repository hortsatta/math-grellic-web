// _ADD
import { kyInstance } from './instance.api';

const BASE_URL = 'activities';

function getActivitySlug() {
  const query = window.location.search;

  console.log("Query string: ", query);

  const params = new URLSearchParams(query);

  const gameSlug = params.get('gameSlug');
  const preview = params.get('preview') === 'true';

  console.log("Game Slug: ", gameSlug);
  console.log("Preview: ", preview);

  return {gameSlug, preview};
}

export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// export async function getActivityBySlugAndCurrentStudentUser() {
//   try {
//     const slug = getActivitySlug();
//     const url = `${BASE_URL}/${slug}/students`

//     const activity = await kyInstance.get(url).json();

//     consol;

//     return activity;
//   } catch (error) {
//     console.log("getActivityBySlugAndCurrentStudentUser error: ", error);
//     return null
//   }
// }

export async function getActivityBySlugAndCurrentStudentUser() {
  try {

    const {gameSlug, preview} = getActivitySlug();

    const url = `${BASE_URL}/${gameSlug}/${preview ? 'teachers' : 'students'}`;

    console.log("url: ", url);

    const activity = await kyInstance.get(url).json();

    console.log("getActivityBySlugAndCurrentStudentUser activity: ", activity);

    return activity;
  } catch (error) {
    console.log("getActivityBySlugAndCurrentStudentUser error: ", error);
    return null
  }
}

export async function setActivityCategoryCompletionBySlugAndCurrentStudentUser(data, categoryId) {
  try {

    const slug = getActivitySlug();
    const url = `${BASE_URL}/${slug}/students/completion/${categoryId}`

    const json = {
      questionAnswers: data,
      timeCompletedSeconds: data.timeCompletedSeconds || 0,
    };

    const completion = await kyInstance.post(url, { json }).json();

    return completion;
  } catch (error) {
    return null;
   
  }
}

export async function updateActivityCategoryCompletionBySlugAndCurrentStudentUser(data, categoryId) {
  try {
    const slug = getActivitySlug();
    const url = `${BASE_URL}/${slug}/students/completion/${categoryId}`

    const json = {
      questionAnswers: data,
      timeCompletedSeconds: data.timeCompletedSeconds || 0,
    };

    const completion = await kyInstance.patch(url, { json }).json();

    return completion;
  } catch (error) {
    return null;
  }
}