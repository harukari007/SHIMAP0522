
        // 島の情報を取得する関数
    function fetchIslandInfo(searchKeyword) {
            return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://api.msil.go.jp/area-name/island/v1/query?units=meter&returnGeometry=true&page=1`, // ページ1をリクエスト
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Ocp-Apim-Subscription-Key': '10784fa6ea604de687b2052e55e03879',
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

    // 島情報をAPIから取得
    fetchIslandInfo(searchKeyword)
                .then(data => {
                    // 検索キーワードに一致する島名だけをフィルタリング
                    const filteredData = data.features.filter(island => {
                        return island.attributes['島名'].includes(searchKeyword);
                    });

    console.log('取得したデータ:', filteredData); // データをコンソールログに出力
    displayIslandInfo({features: filteredData }); // フィルタリングされたデータを表示
                })
                .catch(error => {
        console.error('島のデータの取得中にエラーが発生しました:', error);
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
                const islandName = island.attributes['島名']; // 島の名前
    const islandGeometry = island.geometry; // ジオメトリ情報

    // 島の情報を表示するHTMLを作成し、コンテナに追加
    const islandHtml = `
    <div class="island">
        <h2>${islandName}</h2>
        <p>ジオメトリ情報: ${JSON.stringify(islandGeometry)}</p>
    </div>
    `;
    islandInfoContainer.append(islandHtml);
            });
        }
