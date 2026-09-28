package com.shivanitech.jobportal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import software.amazon.awssdk.services.sns.model.PublishResponse;
import software.amazon.awssdk.services.sns.model.SnsException;

@Service
public class SnsService {

    @Value("${aws.accessKeyId:}")
    private String awsAccessKeyId;

    @Value("${aws.secretKey:}")
    private String awsSecretKey;

    @Value("${aws.region:ap-south-1}")
    private String awsRegion;

    public boolean sendSms(String phoneNumber, String message) {
        if (awsAccessKeyId.isEmpty() || awsSecretKey.isEmpty()) {
            System.err.println("AWS Credentials not set! Could not send SMS to " + phoneNumber);
            return false;
        }

        try {
            SnsClient snsClient = SnsClient.builder()
                .region(Region.of(awsRegion))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(awsAccessKeyId, awsSecretKey)))
                .build();

            // Ensure phone number has country code (rudimentary check)
            if (!phoneNumber.startsWith("+")) {
                phoneNumber = "+91" + phoneNumber; // default to India if not specified
            }

            PublishRequest request = PublishRequest.builder()
                .message(message)
                .phoneNumber(phoneNumber)
                .build();

            PublishResponse result = snsClient.publish(request);
            System.out.println("SMS sent successfully. Message ID: " + result.messageId());
            return true;
        } catch (SnsException e) {
            System.err.println("Error sending SMS: " + e.awsErrorDetails().errorMessage());
            return false;
        }
    }
}
