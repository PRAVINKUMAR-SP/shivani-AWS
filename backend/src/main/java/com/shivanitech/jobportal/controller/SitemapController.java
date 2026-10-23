package com.shivanitech.jobportal.controller;

import com.shivanitech.jobportal.service.SitemapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class SitemapController {

    @Autowired
    private SitemapService sitemapService;

    @GetMapping(value = {"/sitemap.xml", "/api/sitemap.xml"}, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> getSitemap() {
        String xml = sitemapService.generateSitemapXml();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_XML)
                .body(xml);
    }
}
