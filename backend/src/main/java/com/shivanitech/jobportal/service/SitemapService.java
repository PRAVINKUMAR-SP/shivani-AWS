package com.shivanitech.jobportal.service;

import com.shivanitech.jobportal.model.Job;
import com.shivanitech.jobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.time.LocalDate;
import java.util.List;

@Service
public class SitemapService {

    private static final String BASE_URL = "https://shivanitech.in";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Autowired
    private JobRepository jobRepository;

    public String generateSitemapXml() {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        String today = LocalDate.now().format(DATE_FORMATTER);

        // Core Pages
        addUrl(xml, BASE_URL + "/", today, "daily", "1.0");
        addUrl(xml, BASE_URL + "/jobs", today, "daily", "0.9");
        addUrl(xml, BASE_URL + "/companies", today, "weekly", "0.8");
        addUrl(xml, BASE_URL + "/services", today, "weekly", "0.8");
        addUrl(xml, BASE_URL + "/financial", today, "weekly", "0.8");
        addUrl(xml, BASE_URL + "/contact", today, "monthly", "0.7");
        addUrl(xml, BASE_URL + "/test", today, "monthly", "0.6");

        // Keyword Landing Pages
        addUrl(xml, BASE_URL + "/jobs/chennai", today, "weekly", "0.8");
        addUrl(xml, BASE_URL + "/jobs/fresher", today, "weekly", "0.8");
        addUrl(xml, BASE_URL + "/jobs/software-developer", today, "weekly", "0.8");
        addUrl(xml, BASE_URL + "/jobs/java-developer", today, "weekly", "0.8");

        // Dynamic Job Pages from Database
        List<Job> jobs = jobRepository.findAll();
        for (Job job : jobs) {
            if (job.getId() != null) {
                String lastmod = job.getPostedAt() != null 
                        ? job.getPostedAt().format(DATE_FORMATTER) 
                        : today;
                
                String slug = toSlug(job.getTitle() + "-" + (job.getLocation() != null ? job.getLocation() : "india"));
                String jobUrl = BASE_URL + "/jobs/" + job.getId() + (slug.isEmpty() ? "" : "-" + slug);
                addUrl(xml, jobUrl, lastmod, "weekly", "0.8");
            }
        }

        xml.append("</urlset>");
        return xml.toString();
    }

    private void addUrl(StringBuilder xml, String loc, String lastmod, String changefreq, String priority) {
        xml.append("  <url>\n");
        xml.append("    <loc>").append(escapeXml(loc)).append("</loc>\n");
        xml.append("    <lastmod>").append(lastmod).append("</lastmod>\n");
        xml.append("    <changefreq>").append(changefreq).append("</changefreq>\n");
        xml.append("    <priority>").append(priority).append("</priority>\n");
        xml.append("  </url>\n");
    }

    private String toSlug(String input) {
        if (input == null) return "";
        return input.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    private String escapeXml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}
