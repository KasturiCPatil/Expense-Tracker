"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const scraper_service_1 = require("./scraper.service");
let ScraperController = class ScraperController {
    scraperService;
    jobs = new Map();
    constructor(scraperService) {
        this.scraperService = scraperService;
    }
    async triggerScrape(searchTerm) {
        const jobId = Date.now().toString();
        this.jobs.set(jobId, 'active');
        this.scraperService.scrapeWorldOfBooks(searchTerm)
            .then(() => this.jobs.set(jobId, 'completed'))
            .catch((err) => {
            console.error('Scraping failed:', err);
            this.jobs.set(jobId, 'failed');
        });
        return { jobId, status: 'Accepted' };
    }
    async getJobStatus(jobId) {
        const state = this.jobs.get(jobId) || 'Not Found';
        return {
            id: jobId,
            state,
        };
    }
};
exports.ScraperController = ScraperController;
__decorate([
    (0, common_1.Post)('trigger'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger a new scraping job' }),
    (0, swagger_1.ApiResponse)({ status: 202, description: 'The job has been accepted.' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: true, example: 'harry potter' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "triggerScrape", null);
__decorate([
    (0, common_1.Get)('job-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the status of a scraping job' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return job status.' }),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "getJobStatus", null);
exports.ScraperController = ScraperController = __decorate([
    (0, swagger_1.ApiTags)('scraper'),
    (0, common_1.Controller)('scraper'),
    __metadata("design:paramtypes", [scraper_service_1.ScraperService])
], ScraperController);
//# sourceMappingURL=scraper.controller.js.map