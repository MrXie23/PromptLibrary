document.addEventListener('DOMContentLoaded', function() {
    // 主题切换
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        if (icon.classList.contains('fa-moon')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });
    
    // 搜索功能
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('.search-button');
    
    searchButton.addEventListener('click', function() {
        performSearch();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            alert(`搜索: ${query}\n这里将实现搜索功能，连接到提示词库。`);
            // 实际实现中，这里会触发搜索API调用或过滤本地数据
        }
    }
    
    // 分类项点击
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            alert(`您选择了分类: ${category}\n这里将展示该分类下的所有提示词。`);
        });
    });
    
    // 添加滚动动效
    function revealOnScroll() {
        const elements = document.querySelectorAll('.prompt-card, .category-item');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - 50) {
                element.classList.add('visible');
            }
        });
    }
    
    // 初始检查
    revealOnScroll();
    
    // 滚动时检查
    window.addEventListener('scroll', revealOnScroll);
});