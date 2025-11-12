'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle, Info, Star, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStrapiImageUrl } from '@/lib/cms-client';
import type { SectionData } from '@/lib/validators/homepage';
import { AnimatedGrid } from '@/components/reactbits/animated-grid';
import { GradientText } from '@/components/reactbits/gradient-text';
import { NumberTicker } from '@/components/reactbits/number-ticker';
import { Dock } from '@/components/reactbits/dock';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeroAdvancedProps {
  data: Extract<SectionData, { __component: 'section.hero-advanced' }>;
  locale: string;
}

const iconMap = {
  CheckCircle,
  Info,
  Star,
  HelpCircle,
};

export function HeroAdvanced({ data, locale }: HeroAdvancedProps) {
  const {
    headline,
    subheadline,
    primary_cta,
    secondary_cta,
    background_image_desktop,
    background_image_mobile,
    overlay_opacity = 40,
    trust_indicators = [],
    stats = [],
    hotspots = [],
    layout_variant = 'golden-ratio-split',
    enable_gradient_text = true,
    enable_animated_grid = true,
  } = data;

  const desktopImageUrl = getStrapiImageUrl(background_image_desktop);
  const mobileImageUrl = getStrapiImageUrl(
    background_image_mobile || background_image_desktop
  );

  const prefix = locale === 'en' ? '' : `/${locale}`;

  // Convert stats to Dock format
  const dockItems = stats.map((stat, index) => ({
    id: `stat-${index}`,
    label: stat.label,
    value: stat.value,
    prefix: stat.prefix || '',
    suffix: stat.suffix || '',
  }));

  // Desktop layout: Golden Ratio split (60/40)
  if (layout_variant === 'golden-ratio-split') {
    return (
      <section
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        itemScope
        itemType="https://schema.org/Organization"
      >
        {enable_animated_grid && (
          <AnimatedGrid
            className="absolute inset-0 opacity-30"
            size={60}
            gap={4}
            color="#059669"
            opacity={0.1}
          />
        )}

        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Content Zone (60% - 3 columns) */}
            <div className="lg:col-span-3 space-y-6 lg:space-y-8">
              {/* Trust Badge */}
              {trust_indicators.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {trust_indicators.map((indicator, index) => {
                    const IconComponent =
                      iconMap[
                        (indicator.icon_name as keyof typeof iconMap) ||
                          'CheckCircle'
                      ] || CheckCircle;
                    return (
                      <div
                        key={index}
                        className={cn(
                          'flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200',
                          !indicator.show_on_mobile && 'hidden md:flex'
                        )}
                      >
                        <IconComponent className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {indicator.text}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {/* Headline */}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                itemProp="name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {enable_gradient_text ? (
                  <GradientText
                    gradient="from-green-600 via-green-500 to-green-700"
                    animate={true}
                    duration={3}
                  >
                    {headline}
                  </GradientText>
                ) : (
                  <span className="text-green-800">{headline}</span>
                )}
              </motion.h1>

              {/* Subheadline */}
              {subheadline && (
                <motion.p
                  className="text-lg md:text-xl lg:text-2xl text-green-700 max-w-2xl leading-relaxed"
                  itemProp="description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {subheadline}
                </motion.p>
              )}

              {/* CTAs */}
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button
                  asChild
                  variant={primary_cta.variant || 'primary'}
                  size="lg"
                >
                  <a
                    href={primary_cta.url}
                    target={primary_cta.open_in_new_tab ? '_blank' : undefined}
                    rel={
                      primary_cta.open_in_new_tab ? 'noopener noreferrer' : undefined
                    }
                  >
                    {primary_cta.text}
                  </a>
                </Button>
                {secondary_cta && (
                  <Button
                    asChild
                    variant={secondary_cta.variant || 'outline'}
                    size="lg"
                  >
                    <a
                      href={secondary_cta.url}
                      target={
                        secondary_cta.open_in_new_tab ? '_blank' : undefined
                      }
                      rel={
                        secondary_cta.open_in_new_tab
                          ? 'noopener noreferrer'
                          : undefined
                      }
                    >
                      {secondary_cta.text}
                    </a>
                  </Button>
                )}
              </motion.div>

              {/* Stats Dock */}
              {stats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Dock items={dockItems} orientation="horizontal" />
                </motion.div>
              )}
            </div>

            {/* Visual Zone (40% - 2 columns) */}
            <div className="lg:col-span-2 relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                {/* Background Image */}
                <Image
                  src={desktopImageUrl}
                  alt={
                    background_image_desktop.data?.attributes?.alternativeText ||
                    headline
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                  style={{ opacity: overlay_opacity / 100 }}
                />

                {/* Hotspots */}
                {hotspots.length > 0 && (
                  <TooltipProvider>
                    {hotspots.map((hotspot, index) => {
                      const IconComponent =
                        hotspot.icon_type === 'question'
                          ? HelpCircle
                          : hotspot.icon_type === 'star'
                          ? Star
                          : hotspot.icon_type === 'check'
                          ? CheckCircle
                          : Info;

                      return (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <motion.button
                              className="absolute rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-600"
                              style={{
                                left: `${hotspot.position_x}%`,
                                top: `${hotspot.position_y}%`,
                                transform: 'translate(-50%, -50%)',
                              }}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                delay: 0.5 + index * 0.1,
                                type: 'spring',
                                stiffness: 200,
                              }}
                              aria-label={hotspot.tooltip_title}
                            >
                              <IconComponent className="h-5 w-5 text-green-600" />
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-semibold">
                                {hotspot.tooltip_title}
                              </p>
                              {hotspot.tooltip_content && (
                                <p className="text-sm text-green-700">
                                  {hotspot.tooltip_content}
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Mobile/Overlay layout
  return (
    <section
      className="relative min-h-[70vh] md:min-h-[90vh] flex items-end overflow-hidden"
      itemScope
      itemType="https://schema.org/Organization"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={mobileImageUrl}
          alt={
            background_image_mobile?.data?.attributes?.alternativeText ||
            background_image_desktop.data?.attributes?.alternativeText ||
            headline
          }
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          style={{ opacity: overlay_opacity / 100 }}
        />
      </div>

      {/* Content Overlay */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-2xl space-y-6">
          {/* Trust Indicators */}
          {trust_indicators.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {trust_indicators
                .filter((indicator) => indicator.show_on_mobile !== false)
                .map((indicator, index) => {
                  const IconComponent =
                    iconMap[
                      (indicator.icon_name as keyof typeof iconMap) ||
                        'CheckCircle'
                    ] || CheckCircle;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/20"
                    >
                      <IconComponent className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-white">
                        {indicator.text}
                      </span>
                    </div>
                  );
                })}
            </motion.div>
          )}

          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
            itemProp="name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {enable_gradient_text ? (
              <GradientText
                gradient="from-white via-green-50 to-white"
                animate={true}
                duration={3}
              >
                {headline}
              </GradientText>
            ) : (
              headline
            )}
          </motion.h1>

          {/* Subheadline */}
          {subheadline && (
            <motion.p
              className="text-lg md:text-xl text-white/90 max-w-xl"
              itemProp="description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {subheadline}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              asChild
              variant={primary_cta.variant || 'primary'}
              size="lg"
            >
              <a
                href={primary_cta.url}
                target={primary_cta.open_in_new_tab ? '_blank' : undefined}
                rel={
                  primary_cta.open_in_new_tab ? 'noopener noreferrer' : undefined
                }
              >
                {primary_cta.text}
              </a>
            </Button>
            {secondary_cta && (
              <Button
                asChild
                variant={secondary_cta.variant || 'outline'}
                size="lg"
                className="bg-white/10 border-white text-white hover:bg-white/20"
              >
                <a
                  href={secondary_cta.url}
                  target={
                    secondary_cta.open_in_new_tab ? '_blank' : undefined
                  }
                  rel={
                    secondary_cta.open_in_new_tab
                      ? 'noopener noreferrer'
                      : undefined
                  }
                >
                  {secondary_cta.text}
                </a>
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Stats below on mobile */}
      {stats.length > 0 && (
        <div className="container mx-auto px-4 py-8 relative z-10 bg-white/95 backdrop-blur-sm">
          <Dock items={dockItems} orientation="horizontal" />
        </div>
      )}
    </section>
  );
}

