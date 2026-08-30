/**
 * 若狭県防災・安全情報システム「S.H.I.N.WA」 JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. リアルタイム時計機能
    function updateClock() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const clockElem = document.getElementById('current-clock');
        if (clockElem) {
            clockElem.textContent = `${year}年${month}月${date}日 ${hours}:${minutes}:${seconds}`;
        }
    }
    
    // 1秒ごとに更新
    setInterval(updateClock, 1000);
    updateClock();

    // 2. アクセシビリティパネル開閉
    const btnAccessibility = document.getElementById('btn-accessibility');
    const panel = document.getElementById('accessibility-panel');

    if (btnAccessibility && panel) {
        btnAccessibility.addEventListener('click', function(e) {
            e.preventDefault();
            panel.classList.toggle('style-hidden');
        });
    }

    // 3. 文字サイズ変更処理
    const sizeButtons = document.querySelectorAll('.btn-size');
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('btn-active'));
            this.classList.add('btn-active');

            const size = this.getAttribute('data-size');
            document.body.classList.remove('size-small', 'size-medium', 'size-large');
            document.body.classList.add(`size-${size}`);
        });
    });

    // 4. 配色変更（高コントラスト切り替え）
    const colorButtons = document.querySelectorAll('.btn-color');
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            colorButtons.forEach(btn => btn.classList.remove('btn-active'));
            this.classList.add('btn-active');

            const color = this.getAttribute('data-color');
            if (color === 'high-contrast') {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        });
    });

    // 5. 最新情報更新ボタンの擬似処理
    const btnRefresh = document.getElementById('btn-refresh');
    const statusUpdateTime = document.getElementById('status-update-time');

    if (btnRefresh && statusUpdateTime) {
        btnRefresh.addEventListener('click', function() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const date = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            
            statusUpdateTime.textContent = `${year}年${month}月${date}日 ${hours}時${minutes}分`;
            alert('最新の情報に更新しました。');
        });
    }

});

/*
 * 一時的に無効化中: 気象庁API連携の処理
 * 後で再開する際はこのブロックのコメントアウトを解除してください。
 */
/*
document.addEventListener('DOMContentLoaded', function() {

    // 気象庁エリアコード設定
    const AREA_REIHOKU = "180010"; // 福井県嶺北（県北部・越前町等）
    const AREA_REINAN  = "180020"; // 福井県嶺南（県南部・若狭等）

    async function fetchFukuiWeatherWarnings() {
        const statusBody = document.getElementById('weather-status-body');
        const updateTimeElem = document.getElementById('status-update-time');

        if (!statusBody) return;

        try {
            // 気象庁 防災情報JSON API（福井県全体: 180000）
            const response = await fetch('https://www.jma.go.jp/bosai/warning/data/warning/180000.json');
            
            if (!response.ok) {
                throw new Error('気象データの取得に失敗しました');
            }

            const data = await response.json();

            // 嶺北・嶺南それぞれのデータ抽出処理
            const reihokuData = extractAreaData(data, AREA_REIHOKU);
            const reinanData  = extractAreaData(data, AREA_REINAN);

            // それぞれの警報・注意報を解析
            const reihokuStatus = parseWarnings(reihokuData);
            const reinanStatus  = parseWarnings(reinanData);

            // テーブル表示の更新
            statusBody.innerHTML = `
                <tr>
                    <th>特別警報</th>
                    <td>${formatStatusList(reihokuStatus.special, 'danger')}</td>
                    <td>${formatStatusList(reinanStatus.special, 'danger')}</td>
                </tr>
                <tr>
                    <th>警報</th>
                    <td>${formatStatusList(reihokuStatus.warning, 'warning')}</td>
                    <td>${formatStatusList(reinanStatus.warning, 'warning')}</td>
                </tr>
                <tr>
                    <th>注意報</th>
                    <td>${formatStatusList(reihokuStatus.advisory, 'info')}</td>
                    <td>${formatStatusList(reinanStatus.advisory, 'info')}</td>
                </tr>
                <tr>
                    <th>土砂災害警戒情報</th>
                    <td>${reihokuStatus.landslide 
                        ? '<span class="status-warning">発表中</span>' 
                        : '<span class="status-none">発表なし</span>'}</td>
                    <td>${reinanStatus.landslide 
                        ? '<span class="status-warning">発表中</span>' 
                        : '<span class="status-none">発表なし</span>'}</td>
                </tr>
            `;

            // 発表日時反映
            if (data.reportDatetime && updateTimeElem) {
                const reportDate = new Date(data.reportDatetime);
                const year = reportDate.getFullYear();
                const month = String(reportDate.getMonth() + 1).padStart(2, '0');
                const date = String(reportDate.getDate()).padStart(2, '0');
                const hours = String(reportDate.getHours()).padStart(2, '0');
                const minutes = String(reportDate.getMinutes()).padStart(2, '0');
                
                updateTimeElem.textContent = `${year}年${month}月${date}日 ${hours}時${minutes}分`;
            }

        } catch (error) {
            console.error('Weather API Error:', error);
            statusBody.innerHTML = `
                <tr>
                    <td colspan="3" style="color: red; text-align: center;">
                        気象情報の取得に失敗しました。（${error.message}）
                    </td>
                </tr>
            `;
        }
    }

    // エリアコードに該当する領域データを検索・抽出する補助関数
    function extractAreaData(data, targetAreaCode) {
        if (!data || !data.areaTypes) return null;
        for (const areaType of data.areaTypes) {
            if (areaType.areas) {
                const found = areaType.areas.find(a => a.code === targetAreaCode);
                if (found) return found;
            }
        }
        return null;
    }

    // 警報・注意報配列を分類整理する補助関数
    function parseWarnings(areaData) {
        const result = {
            special: [],
            warning: [],
            advisory: [],
            landslide: false
        };

        if (areaData && areaData.warnings) {
            areaData.warnings.forEach(w => {
                if (w.status === "発表" || w.status === "継続") {
                    const code = parseInt(w.code, 10);
                    const name = getWarningName(code);

                    if (code === 50) {
                        result.landslide = true;
                    } else if (code >= 30 && code < 40) {
                        result.special.push(name);
                    } else if (code >= 10 && code < 20) {
                        result.warning.push(name);
                    } else if (code >= 20 && code < 30) {
                        result.advisory.push(name);
                    }
                }
            });
        }
        return result;
    }

    // 警報名フォーマット
    function formatStatusList(list, type) {
        if (!list || list.length === 0) {
            return '<span class="status-none">発表なし</span>';
        }
        const className = type === 'danger' || type === 'warning' ? 'status-warning' : 'status-info';
        return list.map(name => `<span class="${className}">${name}</span>`).join('、 ');
    }

    // 気象庁 警報・注意報コード変換
    function getWarningName(code) {
        const names = {
            10: '大雨警報', 12: '大雪警報', 13: '暴風警報', 14: '暴風雪警報', 15: '波浪警報', 16: '高潮警報', 17: '洪水警報',
            20: '大雨注意報', 21: '大雪注意報', 22: '強風注意報', 23: '風雪注意報', 24: '波浪注意報', 25: '高潮注意報',
            26: '融雪注意報', 27: '洪水注意報', 28: '乾燥注意報', 29: '濃霧注意報', 30: '着氷注意報', 31: '着雪注意報', 32: '雪崩注意報', 33: '雷注意報',
            35: '大雨特別警報', 36: '大雪特別警報', 37: '暴風特別警報', 38: '暴風雪特別警報', 39: '波浪特別警報', 40: '高潮特別警報'
        };
        return names[code] || `警報/注意報(${code})`;
    }

    // 初回呼び出し
    fetchFukuiWeatherWarnings();

    // 更新ボタンイベント
    const btnRefresh = document.getElementById('btn-refresh');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', function() {
            fetchFukuiWeatherWarnings();
            alert('気象情報を最新状態に更新しました。');
        });
    }

});
*/