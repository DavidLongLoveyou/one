"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    register() { },
    async bootstrap({ strapi }) {
        const actions = [
            'api::homepage.homepage.find',
            'api::site-settings.site-settings.find',
            'api::global-seo.global-seo.find',
            'api::contact-page.contact-page.find',
            'api::product.product.find',
            'api::product.product.findOne',
            'api::service.service.find',
            'api::service.service.findOne',
            'api::knowledge-asset.knowledge-asset.find',
            'api::knowledge-asset.knowledge-asset.findOne',
            'api::category.category.find',
            'api::category.category.findOne',
            'api::author.author.find',
            'api::author.author.findOne',
            'api::certification.certification.find',
            'api::certification.certification.findOne',
            'api::testimonial.testimonial.find',
            'api::testimonial.testimonial.findOne',
        ];
        const roleQuery = strapi.db.query('plugin::users-permissions.role');
        const publicRole = await roleQuery.findOne({ where: { type: 'public' } });
        if (!publicRole)
            return;
        for (const action of actions) {
            const permQuery = strapi.db.query('plugin::users-permissions.permission');
            const existing = await permQuery.findOne({ where: { action, role: publicRole.id } });
            if (!existing) {
                await permQuery.create({ data: { action, role: publicRole.id } });
            }
        }
    },
};
