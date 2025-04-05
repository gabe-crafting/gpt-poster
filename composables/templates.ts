import {useLocalStorage} from "@vueuse/core";

interface Template {
    name: string;
    content: string;
}

export const useTemplates = () => {
    const templates = useLocalStorage<Template[]>('templates', [])

    const addTemplate = (template: Template) => {
        if (!templates.value.includes(template)) {
            templates.value.push(template);
        }
    }

    const removeTemplate = (template: Template) => {
        const index = templates.value.indexOf(template);
        if (index !== -1) {
            templates.value.splice(index, 1);
        }
    }

    const getTemplate = (name: string) => {
        const template = templates.value.find(t => t.name === name);
        return template ? template.content : null;
    }

    return {templates, addTemplate, removeTemplate, getTemplate}
}