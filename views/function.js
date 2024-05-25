const loading = document.getElementById("loading");
const link_ig = document.getElementById("link_url");
const paste_link = document.getElementById("paste_link");
const download_link = document.getElementById("download_link");

paste_link.addEventListener("click", async () => {
    try {
        link_ig.value = await navigator.clipboard.readText();
    } catch (e) {
        console.error("Error pasting from clipboard:", e);
    }
});
download_link.addEventListener("click", function () {
    download_link.style.display = "none";
    loading.style.display = "block";

    if (link_ig.value === "") {
        download_link.style.display = "block";
        loading.style.display = "none";
    }

    setTimeout(function () {
        download_link.style.display = "block";
        loading.style.display = "none";
        link_ig.value = "";
    }, 30000);
});


document.addEventListener('DOMContentLoaded', function () {
    const accordionButtons = document.querySelectorAll('.accordion-button');

    accordionButtons.forEach(button => {
        button.addEventListener('click', function () {
            const content = button.parentElement.nextElementSibling;
            const allContents = document.querySelectorAll('.content');

            allContents.forEach(item => {
                if (item !== content) {
                    item.classList.remove('show');
                    item.previousElementSibling.querySelector('.accordion-button').classList.add('collapsed');
                }
            });

            content.classList.toggle('show');
            button.classList.toggle('collapsed');
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarNav2 = document.querySelector("#navbarNav2");
    const header = document.querySelector("header");

    navbarToggler.addEventListener("click", function() {
        navbarNav2.classList.toggle("show");
        header.classList.toggle("expanded");
    });
});
