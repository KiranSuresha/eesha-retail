import React, { useMemo, useState } from 'react';

import Layout from '../components/Layout/Layout';
import * as styles from './qr-generator.module.css';

const contentTypes = [
  'Website',
  'Product',
  'Blog',
  'Link',
  'Promotion',
  'Other',
];

const defaultExamples = {
  Website: 'https://yourcompany.com',
  Product: 'https://yourcompany.com/products/sku-1234',
  Blog: 'https://yourcompany.com/blog/how-we-source',
  Link: 'https://linktr.ee/yourcompany',
  Promotion: 'https://yourcompany.com/sale',
  Other: 'Add any text, URL, phone number, or message',
};

const QrGeneratorPage = () => {
  const [contentType, setContentType] = useState('Website');
  const [destination, setDestination] = useState(defaultExamples.Website);
  const [qrLabel, setQrLabel] = useState('Company destination');
  const [size, setSize] = useState(240);

  const hasValue = destination.trim().length > 0;

  const qrValue = useMemo(() => {
    if (!hasValue) {
      return 'https://yourcompany.com';
    }

    return destination.trim();
  }, [destination, hasValue]);

  const qrImageUrl = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&ecc=H&data=${encodeURIComponent(
        qrValue,
      )}`,
    [qrValue, size],
  );

  const handleDownload = async () => {
    const response = await fetch(qrImageUrl);
    const fileBlob = await response.blob();

    const blobUrl = URL.createObjectURL(fileBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = `${contentType.toLowerCase()}-qr.png`;
    downloadLink.click();
    URL.revokeObjectURL(blobUrl);
  };

  const handleTypeChange = (event) => {
    const nextType = event.target.value;

    setContentType(nextType);
    setDestination(defaultExamples[nextType]);
  };

  return (
    <Layout>
      <section className={styles.wrapper}>
        <div className={styles.headlineBlock}>
          <p className={styles.eyebrow}>Company Tool</p>
          <h1>QR code generator</h1>
          <p>
            Generate reusable QR codes for websites, products, blogs, social
            links, promos, and any custom destination.
          </p>
        </div>

        <div className={styles.grid}>
          <form
            className={styles.form}
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="contentType">Destination type</label>
            <select
              id="contentType"
              value={contentType}
              onChange={handleTypeChange}
            >
              {contentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label htmlFor="destination">Destination URL or content</label>
            <textarea
              id="destination"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              rows={4}
              placeholder={defaultExamples[contentType]}
            />

            <label htmlFor="label">Display label (optional)</label>
            <input
              id="label"
              type="text"
              value={qrLabel}
              onChange={(event) => setQrLabel(event.target.value)}
              placeholder="Campaign name or internal label"
            />

            <label htmlFor="size">QR size ({size}px)</label>
            <input
              id="size"
              type="range"
              min="180"
              max="360"
              step="20"
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
            />
          </form>

          <div className={styles.previewCard}>
            <div className={styles.qrFrame}>
              <img
                src={qrImageUrl}
                alt={`QR code for ${contentType}`}
                width={size}
                height={size}
              />
            </div>

            {qrLabel && <p className={styles.label}>{qrLabel}</p>}
            <p className={styles.previewText}>{qrValue}</p>

            <button
              type="button"
              className={styles.downloadButton}
              onClick={handleDownload}
              disabled={!hasValue}
            >
              Download PNG
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default QrGeneratorPage;
