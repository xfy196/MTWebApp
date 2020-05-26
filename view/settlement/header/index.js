;; (() => {

    /**
     * 返回上一页面
     */
    function backToPage() {
        $(".header i").on("click", () => {
            history.go(-1);
        })
    }

    /**
     * 处理发票切换的事件
     */
    function handleInvoiceSwitching(){
        $(".invoice input").on("click", function(){
           
           $(".invoice-input").toggle(); 
        })
    }

    handleInvoiceSwitching();
    backToPage();
})();