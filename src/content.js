function isFavorited(node) {
  return node.querySelector(".is-favorite") != null;
}

function insertConfirmToFavButton(streamItem) {
  const blockedRel = "favorite_blocked";
  const button = streamItem.querySelector("a[rel=favorite]");
  // いいねボタンが無い要素(DMなど)は無視
  if (!button) return;
  if (!isFavorited(streamItem)) {
    button.rel = blockedRel;
  }
  button.addEventListener("click", () => {
    if (isFavorited(streamItem)) return;
    if (button.rel == blockedRel) {
      const ok = window.confirm("いいねしますか？");
      if (ok) {
        button.rel = "favorite";
        button.click();
      }
    }
  });
}

const observer = new MutationObserver((records) => {
  records.forEach((record) => {
    if (record.target.classList.contains("js-column-detail")) {
      // js-column-detailを開いてから要素が設定されるまで遅延がある？ため少し待つ
      setTimeout(() => {
        record.addedNodes.forEach((node) => {
          if ("querySelectorAll" in node) {
            const streamItems = node.querySelectorAll(".stream-item");
            streamItems.forEach((streamItem) =>
              insertConfirmToFavButton(streamItem)
            );
          }
        });
      }, 500);
    }
    if (record.target.classList.contains("js-chirp-container")) {
      record.addedNodes.forEach((streamItem) =>
        insertConfirmToFavButton(streamItem)
      );
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });
