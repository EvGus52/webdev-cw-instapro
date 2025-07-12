import { renderHeaderComponent } from "./header-component.js";
import { posts, user } from "../index.js";
import { toggleLike, deletePost } from "../api.js";
import { getToken, formatDate } from "../index.js";
import likeActive from "../assets/images/like-active.svg";
import likeNotActive from "../assets/images/like-not-active.svg";

export function renderUserPostsPageComponent({ appEl }) {
  const postsHtml = posts.length
    ? posts
        .map((post) => {
          const formattedDate = formatDate(post.createdAt);

          // Обработка лайков
          let likesText = "";
          if (post.likes && Array.isArray(post.likes)) {
            const likesCount = post.likes.length;
            const likerNames = post.likes.map((like) => like.name);

            if (likesCount === 0) {
              likesText = "0";
            } else if (likesCount === 1) {
              likesText = likerNames[0];
            } else {
              likesText = `${likerNames[0]} и еще ${likesCount - 1}`;
            }
          } else if (typeof post.likes === "number") {
            likesText = post.likes > 0 ? `еще ${post.likes}` : "0";
          }

          // Проверяем, является ли текущий пользователь автором поста
          const isAuthor = user && post.user.id === user.id;

          // Отладочная информация
          console.log("Проверка авторства (страница пользователя):", {
            currentUser: user ? user.id : "не авторизован",
            postAuthor: post.user.id,
            isAuthor: isAuthor,
            postId: post.id,
          });

          return `
            <li class="post">
              <div class="post-header" data-user-id="${post.user.id}">
                <img src="${
                  post.user.imageUrl
                }" class="post-header__user-image">
                <p class="post-header__user-name">${post.user.name}</p>
                ${
                  isAuthor
                    ? `<button class="delete-post-btn" data-post-id="${post.id}" title="Удалить пост">×</button>`
                    : ""
                }
              </div>
              <div class="post-image-container">
                <img class="post-image" src="${post.imageUrl}" alt="Пост">
              </div>
              <div class="post-likes">
                <button data-post-id="${post.id}" class="like-button">
                    <img src="${post.isLiked ? likeActive : likeNotActive}">
                </button>
                <p class="post-likes-text">
                  Нравится: <strong>${likesText}</strong>
                </p>
              </div>
              <p class="post-text">${post.description}</p>
              <p class="post-date">${formattedDate}</p>
            </li>
          `;
        })
        .join("")
    : "<p>Нет постов</p>";

  const userImageUrl =
    posts.length > 0 ? posts[0].user.imageUrl : "default-avatar.png";
  const userName =
    posts.length > 0 ? posts[0].user.name : "Неизвестный пользователь";

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="posts-user-header">
        <img src="${userImageUrl}" class="posts-user-header__user-image" alt="${userName}">
        <p class="posts-user-header__user-name">${userName}</p>
      </div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  // Обработчики удаления постов
  document.querySelectorAll(".delete-post-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation(); // Предотвращаем всплытие события
      const postId = button.dataset.postId;

      if (confirm("Вы уверены, что хотите удалить этот пост?")) {
        deletePost({
          postId,
          token: getToken(),
        })
          .then(() => {
            // Удаляем пост из массива
            const updatedPosts = posts.filter((p) => p.id !== postId);
            posts.splice(0, posts.length, ...updatedPosts);
            renderUserPostsPageComponent({ appEl });
          })
          .catch((error) => {
            console.error("Ошибка при удалении поста:", error);
            alert(`Ошибка при удалении поста: ${error.message}`);
          });
      }
    });
  });

  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", () => {
      const postId = button.dataset.postId;
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      toggleLike({
        postId,
        token: getToken(),
        isLiked: post.isLiked,
      })
        .then((updatedPost) => {
          const updatedPosts = posts.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                isLiked: updatedPost.post.isLiked,
                likes: updatedPost.post.likes,
              };
            }
            return p;
          });
          posts.splice(0, posts.length, ...updatedPosts);
          renderUserPostsPageComponent({ appEl });
        })
        .catch((error) => {
          console.error("Ошибка при обновлении лайка:", error);
          alert("Только авторизованные пользователи могут лайкать посты");
        });
    });
  });

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
}
