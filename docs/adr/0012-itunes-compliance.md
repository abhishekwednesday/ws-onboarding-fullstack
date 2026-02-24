# ADR 0012: ITunes Compliance Strategy

## Context

The MusicStream application uses the iTunes Search API for music previews and metadata. To use this content lawfully, the application must adhere to specific branding and attribution guidelines provided by Apple.

## Decision

We decided to:

1. **Provide Clear Attribution**: Add "provided courtesy of iTunes" text to every catalog item card that provides a preview.
2. **Include Mandatory Store Links**: Map `trackViewUrl` from the API response and display an official iTunes badge linking directly to the track on the iTunes store.
3. **Proximity Requirement**: Place the attribution and badge in close proximity to the play/preview action to ensure clear association.
4. **Stream-Only Policy**: Emphasize that previews are for promotional streaming use only.
5. **Standardized Branding Assets**: Store official iTunes badges in `public/images/branding/` for consistent cross-app usage.

## Rationale

- **Legal Compliance**: Adhering to these rules is mandatory for continuing to use the iTunes Search API and its content.
- **Trust & Credibility**: Providing clear attribution and store links builds trust with users and respects the original content creators.
- **Accessibility**: Linking back to the store allows users to easily purchase or listen to the full content.

## Consequences

- All music items in the catalog now include mandatory legal disclaimers and store referral links.
- Consistent branding for all external music content.
- Clearer separation between the preview player and the original content source.
