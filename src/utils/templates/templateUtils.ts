import { ITemplate } from 'models/state/templates.model';

export function getUniqueIdFromTemplate(template: ITemplate) {
    return template ? `${template.name}-${template.version}` : null;
}
