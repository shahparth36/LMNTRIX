var myclass1 = document.getElementById("myclass1");
var myclass2 = document.getElementById("myclass2");
var myclass3 = document.getElementById("myclass3");
var myclass4 = document.getElementById("myclass4");
var myclass5 = document.getElementById("myclass5");
var myclass6 = document.getElementById("myclass6");
var iTag1 = document.getElementById("iTag1");
var iTag2 = document.getElementById("iTag2");
var iTag3 = document.getElementById("iTag3");
var iTag4 = document.getElementById("iTag4");
var iTag5 = document.getElementById("iTag5");
var iTag6 = document.getElementById("iTag6");

    myclass1.addEventListener("click", function() {
        if(iTag1.classList) {
        iTag1.classList.toggle("fa-chevron-up")
        iTag1.classList.toggle("fa-chevron-down")
        }
    })
    myclass2.addEventListener("click", function() {
        if(iTag2.classList) {
        iTag2.classList.toggle("fa-chevron-up")
        iTag2.classList.toggle("fa-chevron-down")
        }
    })
    myclass3.addEventListener("click", function() {
        if(iTag3.classList) {
        iTag3.classList.toggle("fa-chevron-up")
        iTag3.classList.toggle("fa-chevron-down")
        }
    })
    myclass4.addEventListener("click", function() {
        if(iTag4.classList) {
        iTag4.classList.toggle("fa-chevron-up")
        iTag4.classList.toggle("fa-chevron-down")
        }
    })
    myclass5.addEventListener("click", function () {
        if (iTag5.classList) {
            iTag5.classList.toggle("fa-chevron-up")
            iTag5.classList.toggle("fa-chevron-down")
        }
    })
    myclass6.addEventListener("click", function () {
        if (iTag6.classList) {
            iTag6.classList.toggle("fa-chevron-up")
            iTag6.classList.toggle("fa-chevron-down")
        }
    })