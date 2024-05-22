// 島の情報を取得する関数
function fetchIslandInfo(searchKeyword) {
    return new Promise((resolve, reject) => {
        // 新しいAPIエンドポイントを使用
        const queryUrl = `https://api.msil.go.jp/island/v2/MapServer/0/query?f=json&where=島名 = '%" + searchKeyword + "%'&returnGeometry=true`;




        $.ajax({
            url: queryUrl,
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Ocp-Apim-Subscription-Key': '0e83ad5d93214e04abf37c970c32b641', // APIキーを設定
            },
            success: function (data) {
                resolve(data); // データ取得成功時に解決
            },
            error: function (xhr, status, error) {
                console.error('Fetch error:', error); // エラー時にコンソールにエラーを表示
                reject(error); // データ取得失敗時に拒否
            }
        });
    });
}

// ページの読み込み完了時に実行する処理
$(document).ready(function () {
    // 検索ボタンのクリックイベントを追加
    $('#searchAreaButton').click(searchIsland);
});

// 島の名前で検索する関数
function searchIsland() {
    const searchKeyword = $('#searchAreaBar').val().trim(); // 検索テキストエリアから入力を取得
    if (!searchKeyword) return; // 検索キーワードが空の場合は処理を終了

    // APIから島情報を取得
    const queryUrl = `https://api.msil.go.jp/island/v2/MapServer/0/query?f=json&where=島名 LIKE '%" + searchKeyword + "%'&returnGeometry=true`; // 検索条件を修正

    fetchIslandInfo(queryUrl)
        .then(data => {
            console.log('取得したデータ:', data); // データをコンソールログに出力
            displayIslandInfo(data); // フィルタリングされたデータを表示
        })
        .catch(error => {
            console.error('島のデータ取得中にエラーが発生しました:', error); // エラー処理を強化
        });
}

// 島の情報を表示する関数
function displayIslandInfo(data) {
    const islandInfoContainer = $('#island-info');
    islandInfoContainer.empty(); // 以前のコンテンツをクリア

    if (!data.features || data.features.length === 0) {
        islandInfoContainer.text('該当する島の情報が見つかりませんでした。');
        return;
    }

    // 検索結果に一致したすべての島を表示
    data.features.forEach(function (island) {
        const attributes = island.attributes;
        const islandName = attributes['島名']; // 島の名前
        const reading = attributes['読み']; // 読み
        const prefecture = attributes['都道府県']; // 都道府県
        const district = attributes['管区']; // 管区
        const provider = attributes['出典・情報提供者']; // 出典・情報提供者
        const year = attributes['データ年度']; // データ年度
        const islandGeometry = island.geometry; // ジオメトリ情報

        // 島の情報を表示するHTMLを作成し、コンテナに追加
        const islandHtml = `
        <div class="island">
        <h2>${islandName}</h2>
        <p>読み: ${reading}</p>
        <p>都道府県: ${prefecture}</p>
        <p>管区: ${district}</p>
        <p>出典・情報提供者: ${provider}</p>
        <p>データ年度: ${year}</p>
        <p>ジオメトリ情報: ${JSON.stringify(islandGeometry)}</p>  </div>
    `;
        islandInfoContainer.append(islandHtml);
    });
}