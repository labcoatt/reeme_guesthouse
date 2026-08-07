/**
 * MultiStateSendButton Animation Script (Vanilla JS implementation)
 * Replicates the multi-state (Idle -> Loading -> Success -> Reset/Redirect) 
 * React component animation with spring transitions, spinners, and checkmark feedback.
 */

(function () {
    'use strict';

    function initMultiStateButtons() {
        const selector = 'button, a.click-shrink, [data-multi-state="true"]';
        
        document.querySelectorAll(selector).forEach(btn => {
            // Exclude drawer/slider control buttons that don't represent form/CTA actions
            if (
                btn.classList.contains('slider-btn') || 
                btn.id === 'menu-trigger-btn' || 
                btn.id === 'sidebar-close-btn' ||
                btn.getAttribute('data-no-multi-state') === 'true'
            ) {
                return;
            }

            // Ensure button has smooth transition styles
            btn.classList.add('transition-all', 'duration-300', 'active:scale-95', 'hover:scale-[1.02]', 'select-none', 'relative', 'overflow-hidden');

            btn.addEventListener('click', function (e) {
                const currentStatus = this.getAttribute('data-status') || 'idle';
                if (currentStatus !== 'idle') {
                    e.preventDefault();
                    return;
                }

                const isLink = this.tagName.toLowerCase() === 'a' && this.getAttribute('href') && !this.getAttribute('href').startsWith('#');
                const targetUrl = isLink ? this.getAttribute('href') : null;

                // Stop instant jump if hyperlink so we can play the multi-state animation
                if (isLink) {
                    e.preventDefault();
                }

                // Custom labels or defaults matching MultiStateSendButtonProps
                const idleHTML = this.innerHTML;
                const loadingLabel = this.getAttribute('data-loading-label') || 'Sending...';
                const successLabel = this.getAttribute('data-success-label') || 'Sent Successfully!';

                // Lock dimensions during state transition
                const originalWidth = this.offsetWidth;
                if (originalWidth > 0) {
                    this.style.minWidth = `${originalWidth}px`;
                }

                // SET STATE: LOADING
                this.setAttribute('data-status', 'loading');
                this.classList.add('pointer-events-none', 'opacity-90');

                // Render Loading State (Spinner + Loading Label with slide-up transition)
                this.innerHTML = `
                    <span class="relative z-10 flex items-center justify-center gap-2 font-medium animate-fadeInUp">
                        <svg class="size-4 animate-spin text-current flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        <span>${loadingLabel}</span>
                    </span>
                `;

                // SET STATE: SUCCESS (after ~1200ms)
                setTimeout(() => {
                    this.setAttribute('data-status', 'success');
                    this.classList.remove('opacity-90');

                    // Render Success State (Checkmark + Success Label with scale spring transition)
                    this.innerHTML = `
                        <span class="relative z-10 flex items-center justify-center gap-2 font-bold text-emerald-400 animate-bounceIn">
                            <svg class="size-4 stroke-[3] text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span>${successLabel}</span>
                        </span>
                    `;

                    // Handle Navigation or Auto-Reset
                    setTimeout(() => {
                        if (targetUrl) {
                            window.location.href = targetUrl;
                        } else {
                            // Reset back to Idle State
                            this.setAttribute('data-status', 'idle');
                            this.innerHTML = idleHTML;
                            this.classList.remove('pointer-events-none');
                            this.style.minWidth = '';
                        }
                    }, targetUrl ? 500 : 2500);

                }, 1200);
            });
        });
    }

    // Initialize on DOM load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMultiStateButtons);
    } else {
        initMultiStateButtons();
    }
})();
