import {
    Render
} from './render.js';

export class RoutingController {
    constructor (elHTML, parentController, args, context) {
        this.args = args;
        this.elHTML = elHTML;
        this.originalHTML = elHTML ? elHTML.outerHTML : ''; // restore html string;
        this.context = context;
        this.elOriginalChildNodes = [];
        this.parentController = parentController;
        this.pageVariable = null;
        this.meta = {};
        if (elHTML) {
            const classQuery = elHTML.className.split(' ').map((className) => {
                return `.${className}`;
            }).join('');

            if (classQuery === '.') {
                console.error(`${this.constructor.name}: root html need a class name`);
                return;
            }

            // todo: add swim id to identify node
            if (document.querySelector(classQuery)) {
                this.elShadowHTML = document.querySelector(classQuery);
            } else {
                this.elHTML = elHTML;
            }
            // fix: if binding event on elHTML not in dom tree
            saveOriginalChildRouter(this, elHTML);
        }
    }

    computed () {
        return [];
    }

    async enter (args) {
        this.args = args;
    }

    async render (pageVariable) {
        this.pageVariable = pageVariable;

        if (this.elHTML && this.context.isUpdateDOMFirstRunRouting) {
            revertOriginalChildRouter(this);
            // copy original text to controller elHTML;
            this.elHTML = Render.appendStylesheetToHeadAndRemoveLoaded(this.originalHTML).toDom();
            Render.bindingVariableToDom(this, this.elHTML, this.pageVariable, this.args, this.computed());
            await Render.renderComponentAsync(this.elHTML, this.pageVariable, this.args, this);
            updateDOM(this);
        } else if (this.elShadowHTML && !this.context.isUpdateDOMFirstRunRouting) {
            Render.bindingVariableToDom(this, this.elHTML, this.pageVariable, this.args, this.computed());
            await Render.renderComponentAsync(this.elHTML, this.pageVariable, this.args, this);
            if (this.parentController.elHTML && this.parentController.elHTML.querySelector('.child-router')) {
                const elChildRouters = this.parentController.elHTML.querySelectorAll('.child-router');
                // latest child router element will be replaced by this controller sahdow element
                const elLatestChildRouter = elChildRouters[elChildRouters.length - 1];
                let child = elLatestChildRouter.lastElementChild;
                while (child) {
                    elLatestChildRouter.removeChild(child);
                    child = elLatestChildRouter.lastElementChild;
                }
                elLatestChildRouter.appendChild(this.elHTML);
            }
        }
        if (this.meta && this.meta.title) {
            document.title = this.meta.title;
            if (!this.meta['og:title']) {
                const elMetaOgTitle = document.querySelector('meta[property="og:title"]');
                if (!elMetaOgTitle) {
                    document.head.appendChild(this.createMeta(null, 'og:title', this.meta.title));
                } else {
                    elMetaOgTitle.setAttribute('content', this.meta.title);
                }
            }
        }
        if (this.meta && this.meta['og:title']) {
            const elMetaOgTitle = document.querySelector('meta[property="og:title"]');
            if (!elMetaOgTitle) {
                document.head.appendChild(this.createMeta(null, 'og:title', this.meta.title));
            } else {
                elMetaOgTitle.setAttribute('content', this.meta.title);
            }
        }
        if (this.meta && this.meta.description) {
            const elMetaOgDescription = document.querySelector('meta[property="og:description"]');
            if (!elMetaOgDescription) {
                document.head.appendChild(this.createMeta(null, 'og:description', this.meta.description));
            } else {
                elMetaOgDescription.setAttribute('content', this.meta.description);
            }

            const elMetaDescription = document.querySelector('meta[name="description"]');
            if (!elMetaDescription) {
                document.head.appendChild(this.createMeta('description', null, this.meta.description));
            } else {
                elMetaDescription.setAttribute('content', this.meta.description);
            }
        }

        if (this.meta && this.meta.image) {
            const elMetaOgImage = document.querySelector('meta[property="og:image"]');
            if (!elMetaOgImage) {
                document.head.appendChild(this.createMeta(null, 'og:image', this.meta.image));
            } else {
                elMetaOgImage.setAttribute('content', this.meta.image);
            }
        }

        if (this.meta && this.meta.keywords) {
            const elMetaKeywords = document.querySelector('meta[name="keywords"]');
            if (!elMetaKeywords) {
                document.head.appendChild(this.createMeta('keywords', null, this.meta.keywords));
            } else {
                elMetaKeywords.setAttribute('content', this.meta.keywords);
            }
        }
    }

    async postRender () {
        if (this.elHTML) {
            Render.bindingEvent(this.elHTML, this);
        }
        if (this.elHTML) {
            this.elHTML.querySelectorAll('*').forEach(async (el) => {
                if (el && el.tagName.toLowerCase().indexOf('component-') !== -1) {
                    if (el.componentInstance) {
                        el.componentInstance.postRender();
                    }
                }
            });
        }
    }

    async exit () {
        return true;
    }

    createMeta (name, propertyName, content) {
        const elMeta = document.createElement('meta');
        if (name) {
            elMeta.setAttribute('name', name);
        }
        if (propertyName) {
            elMeta.setAttribute('property', propertyName);
        }
        elMeta.setAttribute('content', content);
        return elMeta;
    }
}

function updateDOM (controllerInstance) {
    let container = null;
    const parentController = controllerInstance.parentController;
    const elRoot = document.querySelector('.root');
    if (!parentController) {
        container = elRoot;
    } else {
        const concreteParent = recrusiveFindConcreteParent(parentController);
        if (concreteParent) {
            container = concreteParent.elHTML.querySelector('.child-router');
        } else {
            container = elRoot;
        }
    }

    if (container) {
        container.innerHTML = '';
        container.appendChild(controllerInstance.elHTML);
    }
}

function recrusiveFindConcreteParent (parentController) {
    if (parentController.elHTML !== null) {
        return parentController;
    } else if (parentController.parentController) {
        return recrusiveFindConcreteParent(parentController.parentController);
    } else {
        // refactor: throw error
    }
}

function saveOriginalChildRouter (controllerInstance, sourceElHTML) {
    // handle stylesheets avoid duplicate load css file
    const stylesheets = [];
    sourceElHTML.childNodes.forEach((el) => {
        if (el.rel === 'stylesheet') {
            stylesheets.push(el);
        }
    });

    for (let i = 0; i < stylesheets.length; i++) {
        sourceElHTML.removeChild(stylesheets[i]);
    }

    // save original elHTML childNodes
    const elChildRouter = sourceElHTML.querySelector('.child-router');
    if (elChildRouter) {
        elChildRouter.childNodes.forEach((childNode) => {
            controllerInstance.elOriginalChildNodes.push(childNode);
        });
    }
}

function revertOriginalChildRouter (controllerInstance) {
    const elChildRouter = controllerInstance.elHTML.querySelector('.child-router');
    if (elChildRouter) {
        elChildRouter.innerHTML = '';
        for (let i = 0; i < controllerInstance.elOriginalChildNodes.length; i++) {
            elChildRouter.appendChild(controllerInstance.elOriginalChildNodes[i]);
        }
    }
}
