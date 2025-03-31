document.addEventListener("DOMContentLoaded", function () {
    const convertBtn = document.querySelector("button.bg-primary");
    const inputCode = document.querySelectorAll("textarea")[0];
    const outputCode = document.querySelectorAll("textarea")[1];
    const fromLanguage = document.querySelectorAll("select")[0];
    const toLanguage = document.querySelectorAll("select")[1];

    // Function to call the backend API for code conversion
    async function convertCode(input, fromLang, toLang) {
        const apiUrl = "/api";

        const payload = {
            input,
            fromLang,
            toLang,
        };

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data && data.convertedCode) {
                return data.convertedCode;
            } else {
                return "// Conversion failed. No response from the server.";
            }
        } catch (error) {
            console.error("Error during conversion:", error);
            return "// Conversion failed due to an error.";
        }
    }

    // Event listener for the Convert button
    convertBtn.addEventListener("click", async () => {
        const input = inputCode.value;
        const fromLang = fromLanguage.value;
        const toLang = toLanguage.value;

        if (input.trim() === "") {
            outputCode.value = "// Please enter some code to convert.";
            return;
        }

        // Add loading state
        const originalText = convertBtn.innerHTML;
        convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Converting';
        convertBtn.disabled = true;

        // Call the convertCode function and display the result
        const convertedCode = await convertCode(input, fromLang, toLang);
        outputCode.value = `// Converted from ${fromLang} to ${toLang}\n${convertedCode}`;

        // Remove loading state
        convertBtn.innerHTML = originalText;
        convertBtn.disabled = false;
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const fromLanguageSelect = document.getElementById("from-language");
    const toLanguageSelect = document.getElementById("to-language");
    const fromLanguageIcon = document.getElementById("from-language-icon");
    const toLanguageIcon = document.getElementById("to-language-icon");

    // Map of languages to their corresponding Font Awesome classes and colors
    const languageIcons = {
        Python: { class: "fab fa-python", color: "text-blue-500" },
        Java: { class: "fab fa-java", color: "text-yellow-500" },
    };

    // Function to update the icon based on the selected language
    function updateIcon(selectElement, iconElement) {
        const selectedLanguage = selectElement.value;
        const iconData = languageIcons[selectedLanguage];

        if (iconData) {
            // Update the icon class and color
            iconElement.className = `${iconData.class} ${iconData.color}`;
        }
    }

    // Event listeners for language selection changes
    fromLanguageSelect.addEventListener("change", () => {
        updateIcon(fromLanguageSelect, fromLanguageIcon);
    });

    toLanguageSelect.addEventListener("change", () => {
        updateIcon(toLanguageSelect, toLanguageIcon);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    // Check for saved user preference in localStorage
    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
        themeIcon.className = "fas fa-moon text-xl"; // Moon icon for dark mode
    } else {
        document.documentElement.classList.remove("dark");
        themeIcon.className = "fas fa-sun text-xl"; // Sun icon for light mode
    }

    // Toggle theme on button click
    themeToggle.addEventListener("click", () => {
        if (document.documentElement.classList.contains("dark")) {
            // Switch to light mode
            document.documentElement.classList.remove("dark");
            themeIcon.className = "fas fa-sun text-xl"; // Sun icon for light mode
            localStorage.setItem("theme", "light"); // Save preference
        } else {
            // Switch to dark mode
            document.documentElement.classList.add("dark");
            themeIcon.className = "fas fa-moon text-xl"; // Moon icon for dark mode
            localStorage.setItem("theme", "dark"); // Save preference
        }
    });

    console.log("Using API Key:", process.env.GOOGLE_API_KEY);
});
