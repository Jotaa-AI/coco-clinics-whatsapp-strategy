// ===== Coco Clínics WhatsApp Strategy Dashboard =====

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initEditButtons();
    initCopyButtons();
    initExportImport();
    initMobileMenu();
    loadSavedEdits();
});

// ===== Navigation =====
function initNavigation() {
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.section;

            // Update active link
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show target section
            sections.forEach(s => s.classList.remove('active'));
            const target = document.getElementById(targetId);
            if (target) {
                target.classList.add('active');
                target.scrollTop = 0;
            }

            // Close mobile sidebar
            closeMobileSidebar();
        });
    });
}

// ===== Edit Functionality =====
function initEditButtons() {
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.template-card, .phase-card, .timeline-item, .template-card.wide');
            if (!container) return;

            const bubbles = container.querySelectorAll('.wa-bubble');
            const isEditing = bubbles[0]?.contentEditable === 'true';

            bubbles.forEach(bubble => {
                if (isEditing) {
                    // Save mode
                    bubble.contentEditable = 'false';
                    bubble.classList.remove('editing');
                    btn.querySelector('span').textContent = '✏️';
                    
                    // Save to localStorage
                    saveEdit(container, bubble);
                    showToast('💾 Cambios guardados');
                } else {
                    // Edit mode
                    bubble.contentEditable = 'true';
                    bubble.classList.add('editing');
                    bubble.focus();
                    btn.querySelector('span').textContent = '💾';
                }
            });
        });
    });
}

function saveEdit(container, bubble) {
    const key = container.dataset.key;
    if (!key) {
        // Try parent containers
        const parent = container.closest('[data-key]');
        if (parent) {
            saveEditByKey(parent.dataset.key, bubble.textContent);
        }
        return;
    }
    saveEditByKey(key, bubble.textContent);
}

function saveEditByKey(key, content) {
    const edits = JSON.parse(localStorage.getItem('coco_strategy_edits') || '{}');
    edits[key] = content;
    localStorage.setItem('coco_strategy_edits', JSON.stringify(edits));
}

function loadSavedEdits() {
    const edits = JSON.parse(localStorage.getItem('coco_strategy_edits') || '{}');
    
    Object.entries(edits).forEach(([key, content]) => {
        const container = document.querySelector(`[data-key="${key}"]`);
        if (container) {
            const bubbles = container.querySelectorAll('.wa-bubble');
            if (bubbles.length === 1) {
                bubbles[0].textContent = content;
            }
        }
    });
}

// ===== Copy Functionality =====
function initCopyButtons() {
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.template-card, .phase-card, .timeline-item, .template-card.wide');
            if (!container) return;

            const bubbles = container.querySelectorAll('.wa-bubble');
            const text = Array.from(bubbles).map(b => b.textContent.trim()).join('\n\n');

            navigator.clipboard.writeText(text).then(() => {
                showToast('📋 Copiado al portapapeles');
            }).catch(() => {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showToast('📋 Copiado al portapapeles');
            });
        });
    });
}

// ===== Export / Import =====
function initExportImport() {
    const btnExport = document.getElementById('btnExport');
    const btnImport = document.getElementById('btnImport');
    const fileImport = document.getElementById('fileImport');

    btnExport.addEventListener('click', () => {
        const data = collectAllContent();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `coco_clinics_estrategia_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('📥 Estrategia exportada');
    });

    btnImport.addEventListener('click', () => {
        fileImport.click();
    });

    fileImport.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                importContent(data);
                showToast('📤 Estrategia importada');
            } catch (err) {
                showToast('❌ Error al importar');
            }
        };
        reader.readAsText(file);
        fileImport.value = '';
    });
}

function collectAllContent() {
    const data = {};
    document.querySelectorAll('[data-key]').forEach(container => {
        const key = container.dataset.key;
        const bubbles = container.querySelectorAll('.wa-bubble');
        data[key] = Array.from(bubbles).map(b => b.textContent.trim());
    });
    return {
        version: '1.0',
        clinic: 'Coco Clínics',
        exportDate: new Date().toISOString(),
        templates: data
    };
}

function importContent(data) {
    if (!data.templates) return;

    Object.entries(data.templates).forEach(([key, contents]) => {
        const container = document.querySelector(`[data-key="${key}"]`);
        if (!container) return;

        const bubbles = container.querySelectorAll('.wa-bubble');
        contents.forEach((content, i) => {
            if (bubbles[i]) {
                bubbles[i].textContent = content;
            }
        });

        // Also save to localStorage
        if (contents.length === 1) {
            saveEditByKey(key, contents[0]);
        }
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.id = 'sidebarOverlay';
    document.body.appendChild(overlay);

    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', closeMobileSidebar);
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

// ===== Toast =====
function showToast(message) {
    const toast = document.getElementById('toast');
    const text = document.getElementById('toastText');
    
    text.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}
