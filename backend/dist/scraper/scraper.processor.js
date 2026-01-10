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
var ScraperProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const scraper_service_1 = require("./scraper.service");
let ScraperProcessor = ScraperProcessor_1 = class ScraperProcessor {
    scraperService;
    logger = new common_1.Logger(ScraperProcessor_1.name);
    constructor(scraperService) {
        this.scraperService = scraperService;
    }
    async handleScrape(job) {
        this.logger.log(`Processing job ${job.id} for term: ${job.data.searchTerm}`);
        try {
            await this.scraperService.scrapeWorldOfBooks(job.data.searchTerm);
            this.logger.log(`Job ${job.id} completed successfully`);
        }
        catch (error) {
            this.logger.error(`Job ${job.id} failed: ${error.message}`);
            throw error;
        }
    }
};
exports.ScraperProcessor = ScraperProcessor;
__decorate([
    (0, bull_1.Process)('scrape'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScraperProcessor.prototype, "handleScrape", null);
exports.ScraperProcessor = ScraperProcessor = ScraperProcessor_1 = __decorate([
    (0, bull_1.Processor)('scraper'),
    __metadata("design:paramtypes", [scraper_service_1.ScraperService])
], ScraperProcessor);
//# sourceMappingURL=scraper.processor.js.map