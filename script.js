document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Navbar scroll effect
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Typed Text Effect
    const typedTextSpan = document.getElementById("typed-text");
    const roles = ["Frontend Engineer", "UI/UX Craftsman", "Full-Stack Developer", "Automation Architect"];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!typedTextSpan) return;
        const currentRole = roles[roleIdx];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typedTextSpan.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentRole.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typeSpeed = 500; // Pause before typing next
        }

        setTimeout(typeEffect, typeSpeed);
    }
    typeEffect();

    // Skill Bar Fill on Scroll
    const skillBars = document.querySelectorAll(".bar-fill");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.getAttribute("data-width");
                entry.target.style.width = targetWidth;
            }
        });
    }, { threshold: 0.2 });

    skillBars.forEach(bar => observer.observe(bar));

    // Filter Projects
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const category = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const cardCat = card.getAttribute("data-category");
                if (category === "all" || cardCat === category) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // Project Preview Modal Logic
    const modalOverlay = document.getElementById("project-modal");
    const modalCloseBtn = document.getElementById("modal-close");
    const modalTitle = document.getElementById("modal-title");
    const modalBadge = document.getElementById("modal-badge");
    const modalDesc = document.getElementById("modal-desc");
    const modalIframe = document.getElementById("modal-iframe");
    const modalFallback = document.getElementById("modal-fallback");
    const modalFallbackText = document.getElementById("modal-fallback-text");
    const modalTags = document.getElementById("modal-tags");
    const modalGithubLink = document.getElementById("modal-github-link");
    const modalLiveLink = document.getElementById("modal-live-link");

    function openProjectModal(card) {
        if (!modalOverlay || !card) return;

        const title = card.getAttribute("data-title") || "Project Details";
        const badge = card.getAttribute("data-badge") || "Application";
        const desc = card.getAttribute("data-desc") || "";
        const previewUrl = card.getAttribute("data-preview-url") || "";
        const githubUrl = card.getAttribute("data-github-url") || "#";

        modalTitle.textContent = title;
        modalBadge.textContent = badge;
        modalDesc.textContent = desc;

        // Tags
        modalTags.innerHTML = "";
        const cardTags = card.querySelectorAll(".project-tags .tag");
        cardTags.forEach(tag => {
            const span = document.createElement("span");
            span.className = "tag";
            span.textContent = tag.textContent;
            modalTags.appendChild(span);
        });

        // Action links
        modalGithubLink.href = githubUrl;
        if (previewUrl) {
            modalLiveLink.style.display = "inline-flex";
            modalLiveLink.href = previewUrl;
            modalIframe.style.display = "block";
            modalFallback.style.display = "none";
            modalIframe.src = previewUrl;
        } else {
            modalLiveLink.style.display = "none";
            modalIframe.style.display = "none";
            modalIframe.src = "about:blank";
            modalFallback.style.display = "flex";
            modalFallbackText.textContent = `${title} is a backend utility / REST service. Source code available on GitHub.`;
        }

        modalOverlay.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    function closeProjectModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove("show");
        document.body.style.overflow = "auto";
        if (modalIframe) modalIframe.src = "about:blank";
    }

    document.querySelectorAll(".btn-open-modal").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const card = btn.closest(".project-card");
            openProjectModal(card);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeProjectModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) closeProjectModal();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("show")) {
            closeProjectModal();
        }
    });

    // Interactive Terminal Logic
    const termInput = document.getElementById("terminal-input");
    const termBody = document.getElementById("terminal-body");

    if (termInput && termBody) {
        termInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const val = termInput.value.trim().toLowerCase();
                termInput.value = "";

                // Append command line
                appendTerminalLine(`<span class="terminal-prompt">karthik@portfolio:~$</span> ${escapeHTML(val)}`);

                // Process output
                processCommand(val);
                termBody.scrollTop = termBody.scrollHeight;
            }
        });
    }

    function appendTerminalLine(htmlContent) {
        const div = document.createElement("div");
        div.className = "terminal-line";
        div.innerHTML = htmlContent;
        termBody.appendChild(div);
    }

    function processCommand(cmd) {
        switch (cmd) {
            case "help":
                appendTerminalLine(`
                    Available commands:<br>
                    - <span style="color:var(--cyan)">whoami</span> : Learn about Karthik Aruva<br>
                    - <span style="color:var(--cyan)">projects</span> : List featured live projects<br>
                    - <span style="color:var(--cyan)">skills</span> : View technical proficiencies<br>
                    - <span style="color:var(--cyan)">contact</span> : Get email and GitHub link<br>
                    - <span style="color:var(--cyan)">clear</span> : Clear terminal screen
                `);
                break;
            case "whoami":
                appendTerminalLine("Karthik Aruva - Full-Stack Developer creating glassmorphic, interactive web products & automated tooling.");
                break;
            case "projects":
                appendTerminalLine(`
                    🚀 Featured Applications:<br>
                    1. GO Bus (Group Ticket Booking Portal)<br>
                    2. AuraHabit (Pomodoro & GPS Habit Tracker)<br>
                    3. AuraFinance (Wealth Metrics Visualizer)<br>
                    4. AuraWeather (Glassmorphic Widget)<br>
                    5. AuraWrite (Live Markdown Studio)<br>
                    6. AuraPass (Secure Credentials Manager)
                `);
                break;
            case "skills":
                appendTerminalLine("Languages & Stacks: HTML5, CSS3, JavaScript (ES6+), Python, FastAPI, Flask, Scraping, Git.");
                break;
            case "contact":
                appendTerminalLine("Email: karthik.aruva@gmail.com | GitHub: github.com/karthik-aruva");
                break;
            case "clear":
                termBody.innerHTML = "";
                break;
            case "":
                break;
            default:
                appendTerminalLine(`<span style="color:#ef4444">Command not found: '${escapeHTML(cmd)}'. Type 'help' for options.</span>`);
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});

// Contact Form Handler
function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (!name || !email || !message) return;

    const toast = document.getElementById("toast-success");
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);

    document.getElementById("contact-name").value = "";
    document.getElementById("contact-email").value = "";
    document.getElementById("contact-message").value = "";
}
