import {
  siteProfile, experiences, ventures, focusAreas, resumeHighlights, education, certifications,
} from "../content/site";
import { orderedWritingPosts } from "../content/writing";

// No separately maintained knowledge base. These are the exact same approved,
// public content objects that render the Home, Work, Resume and Writing pages.
export const SITE_CONTENT = [
  [
    "PROFILE",
    `Name: ${siteProfile.name}`,
    `Location: ${siteProfile.location}`,
    `Current title: ${siteProfile.headline}`,
    `Current segment: ${siteProfile.segment}`,
    `Focus: ${siteProfile.focusLine}`,
    `Introduction: ${siteProfile.introduction}`,
    `LinkedIn: ${siteProfile.linkedinUrl}`,
    `Website: https://deanreese.me`,
  ].join("\n"),
  [
    "PROFESSIONAL EXPERIENCE",
    ...experiences.map((role) => [
      `Company: ${role.company}`,
      `Title: ${role.title}`,
      `Dates: ${role.dates}`,
      ...role.bullets.map((bullet) => `- ${bullet}`),
      ...(role.link ? [`Public portfolio: ${role.link}`] : []),
    ].join("\n")),
  ].join("\n\n"),
  [
    "FOUNDER PORTFOLIO",
    siteProfile.founderOverview,
    `Portfolio website: ${siteProfile.portfolioUrl}`,
    ...ventures.map((venture) => [
      `Product: ${venture.name}`,
      `Description: ${venture.description}`,
      ...("url" in venture && venture.url ? [`URL: ${venture.url}`] : []),
    ].join("\n")),
  ].join("\n\n"),
  [
    "AREAS OF FOCUS",
    ...focusAreas.map((area) => `${area.title}: ${area.description}`),
  ].join("\n"),
  [
    "RESUME HIGHLIGHTS",
    ...resumeHighlights.map((item) => `- ${item}`),
    `Education: ${education}`,
    "CERTIFICATIONS",
    ...certifications.map((item) => `- ${item}`),
  ].join("\n"),
  [
    "PUBLISHED WRITING",
    ...orderedWritingPosts.map((post) => [
      `Title: ${post.title}`,
      `Date: ${post.date}`,
      `Page: https://deanreese.me/writing/${post.slug}`,
      `Summary: ${post.summary}`,
      "Key points:",
      ...post.bullets.map((bullet) => `- ${bullet}`),
      "Full article:",
      post.body,
    ].join("\n")),
  ].join("\n\n"),
].join("\n\n");
