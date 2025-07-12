const personalKey = "evgen";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}
export function addPost({ token, description, imageUrl }) {
  if (!description || !imageUrl) {
    throw new Error("Необходимо передать описание и ссылку на изображение");
  }

  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({ description, imageUrl }),
  })
    .then((response) => {
      console.log("Статус ответа:", response.status);
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(`Ошибка при добавлении поста: ${text}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Пост успешно добавлен:", data);
      return data;
    })
    .catch((error) => {
      console.error("Ошибка при добавлении поста:", error);
      throw error;
    });
}

export function deletePost({ token, postId }) {
  if (!postId) {
    throw new Error("Необходимо передать ID поста для удаления");
  }

  return fetch(`${postsHost}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      console.log("Статус ответа при удалении:", response.status);
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(`Ошибка при удалении поста: ${text}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Пост успешно удален:", data);
      return data;
    })
    .catch((error) => {
      console.error("Ошибка при удалении поста:", error);
      throw error;
    });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

export function getUserPosts({ token, userId }) {
  return fetch(`${postsHost}/user-posts/${userId}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка загрузки постов пользователя");
      }
      return response.json();
    })
    .then((data) => data.posts);
}

export function likePost({ postId, token }) {
  return fetch(`${postsHost}/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Ошибка при лайке поста");
    }
    return response.json();
  });
}

export function dislikePost({ postId, token }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Ошибка при дизлайке поста");
    }
    return response.json();
  });
}

export function toggleLike({ postId, token, isLiked }) {
  const url = `${postsHost}/${postId}/${isLiked ? "dislike" : "like"}`;

  console.log(`Sending request to: ${url}`);

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Ошибка при лайке поста");
    }
    return response.json();
  });
}
