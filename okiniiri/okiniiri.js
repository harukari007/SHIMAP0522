// お気に入り情報を格納するキー名
const FAVORITE_KEY = 'favorite_islands';

// 島の情報を格納するオブジェクトの構造
const IslandData = {
    id: '', // 島のID
    name: '', // 島の名前
    imageUrl: '', // 画像URL
    description: '', // 説明文
};

// 全てのお気に入りを取得
function getAllFavorites() {
    const favoriteIslandsString = localStorage.getItem(FAVORITE_KEY);
    if (!favoriteIslandsString) {
        return [];
    }
    return JSON.parse(favoriteIslandsString).map(islandData => new IslandData(islandData));
}

// 島を お気に入り登録
function addFavorite(islandId) {
    const favorites = getAllFavorites();
    const existingFavorite = favorites.find(island => island.id === islandId);
    if (existingFavorite) {
        return; // すでに お気に入り登録されている場合は何もしない
    }

    const newFavorite = new IslandData({
        id: islandId,
        // その他の情報は仮で設定
        name: `島${islandId}`,
        imageUrl: `https://example.com/images/island${islandId}.jpg`,
        description: `島${islandId}の説明文`,
    });
    favorites.push(newFavorite);
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
}

// 島を お気に入りから削除
function removeFavorite(islandId) {
    const favorites = getAllFavorites();
    const newFavorites = favorites.filter(island => island.id !== islandId);
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(newFavorites));
}

// お気に入りボタンのクリックイベントハンドラ
function handleFavoriteButtonClick(islandId, buttonElement) {
    const isFavorite = getAllFavorites().some(island => island.id === islandId);
    if (isFavorite) {
        removeFavorite(islandId);
        buttonElement.textContent = 'お気に入りに登録';
    } else {
        addFavorite(islandId);
        buttonElement.textContent = 'お気に入りから外す';
    }
}

// ページロード時に お気に入りボタンの状態を初期化
window.addEventListener('DOMContentLoaded', () => {
    const dealCards = document.querySelectorAll('.deal-card');
    dealCards.forEach(card => {
        const islandId = card.dataset.islandId;
        const buttonElement = card.querySelector('.add');
        buttonElement.addEventListener('click', () => handleFavoriteButtonClick(islandId, buttonElement));
    });
});
