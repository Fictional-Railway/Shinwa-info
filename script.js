document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const sizeButtons = document.querySelectorAll('.font-size-btn');
    const FONT_SIZE_KEY = 'wakasa_font_size';
    
    // ----------------------------------------------------
    // 【1】リアルタイム時刻更新機能
    // ----------------------------------------------------
    const timeElement = document.querySelector('.current-time');

    function updateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const timeString = `${year}年${month}月${day}日 ${hours}:${minutes} 現在`;

        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    updateTime();
    setInterval(updateTime, 60000); // 1分ごとに更新

    // ----------------------------------------------------
    // 【2】タブ切り替え機能
    // ----------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // 1. すべてのタブボタンから active クラスを削除し、クリックされたボタンに付与
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // 2. すべてのコンテンツを非表示にし、対応するコンテンツを表示
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            const targetContent = document.getElementById(category + '-content');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------
    // 【3】文字サイズ変更機能
    // ----------------------------------------------------
    
    const savedSize = localStorage.getItem(FONT_SIZE_KEY) || 'medium';
    setFontSize(savedSize);

    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const newSize = this.getAttribute('data-size');
            setFontSize(newSize);
        });
    });

    function setFontSize(size) {
        body.classList.remove('font-small', 'font-medium', 'font-large');
        if (size === 'small') {
            body.classList.add('font-small');
        } else if (size === 'large') {
            body.classList.add('font-large');
        } else {
            body.classList.add('font-medium'); 
        }

        sizeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-size') === size) {
                btn.classList.add('active');
            }
        });

        localStorage.setItem(FONT_SIZE_KEY, size);
    }
    // ----------------------------------------------------
});

document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const sizeButtons = document.querySelectorAll('.font-size-btn');
    const FONT_SIZE_KEY = 'wakasa_font_size';
    
    // ----------------------------------------------------
    // 【1】リアルタイム時刻更新機能
    // ----------------------------------------------------
    const timeElement = document.querySelector('.current-time');

    function updateTime() {
        // 現在の時刻を取得・整形する処理 (省略)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        // 現在の時刻に合わせる
        const timeString = `${year}年${month}月${day}日 ${hours}:${minutes} 現在`;

        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    updateTime();
    // 1分ごとに更新
    setInterval(updateTime, 60000); 

    // ----------------------------------------------------
    // 【2】タブ切り替え機能
    // ----------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // 1. ボタンのアクティブ状態を切り替え
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // 2. コンテンツの表示/非表示を切り替え
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            const targetContent = document.getElementById(category + '-content');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------
    // 【3】文字サイズ変更機能 (コア部分)
    // ----------------------------------------------------
    
    // ページロード時: 保存されたサイズを適用
    const savedSize = localStorage.getItem(FONT_SIZE_KEY) || 'medium';
    setFontSize(savedSize);

    // ボタンクリック時: サイズを変更
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const newSize = this.getAttribute('data-size');
            setFontSize(newSize);
        });
    });

    /**
     * 文字サイズを変更し、LocalStorageに保存する関数
     * @param {string} size - 'small', 'medium', 'large' のいずれか
     */
    function setFontSize(size) {
        // 1. body要素のクラスを操作して、CSSで定義されたサイズを適用
        body.classList.remove('font-small', 'font-medium', 'font-large');
        if (size === 'small') {
            body.classList.add('font-small');
        } else if (size === 'large') {
            body.classList.add('font-large');
        } else {
            // 'medium'がデフォルトサイズ
            body.classList.add('font-medium'); 
        }

        // 2. ユーティリティバーのボタンのアクティブ状態を切り替える
        sizeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-size') === size) {
                btn.classList.add('active');
            }
        });

        // 3. 次回アクセス時のためにLocalStorageに保存
        localStorage.setItem(FONT_SIZE_KEY, size);
    }
    // ----------------------------------------------------
});