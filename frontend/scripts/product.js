// Set current date
        document.getElementById('scanDate').textContent = new Date().toLocaleDateString();
        
        // Animate progress bar
        setTimeout(() => {
            document.getElementById('progressFill').style.width = '100%';
        }, 500);
        
        // Interactive steps
        const steps = document.querySelectorAll('.step');
        let currentStep = 0;
        
        function showStep(stepIndex) {
            steps.forEach((step, index) => {
                step.classList.remove('active');
                if (index === stepIndex) {
                    step.classList.add('active');
                }
            });
        }
        
        // Auto-cycle through steps
        setInterval(() => {
            showStep(currentStep);
            currentStep = (currentStep + 1) % steps.length;
        }, 3000);
        
        // Click interaction
        steps.forEach((step, index) => {
            step.addEventListener('click', () => {
                currentStep = index;
                showStep(currentStep);
            });
        });
        
        // Add pulse animation to sustainability score
        const score = document.querySelector('.sustainability-score');
        score.classList.add('pulse');
        
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe sections for scroll animations
        document.querySelectorAll('.section, .info-card').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });