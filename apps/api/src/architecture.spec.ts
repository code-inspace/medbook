import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

/**
 * Garde-fou d'architecture : la règle de dépendance de l'hexagonal est vérifiée
 * à chaque `pnpm test`. Si quelqu'un importe Prisma dans un use case, le build casse.
 */

type Layer = 'domain' | 'application';

const SRC = __dirname;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    const isSource = path.endsWith('.ts') && !/\.(spec|fake|d)\.ts$/.test(path);
    return isSource ? [path] : [];
  });
}

function layerOf(file: string): Layer | null {
  const segments = relative(SRC, file).split(sep);
  if (segments.includes('domain')) return 'domain';
  if (segments.includes('application')) return 'application';
  return null;
}

function importsOf(file: string): { specifier: string; names: string }[] {
  const source = readFileSync(file, 'utf8');
  const pattern = /import\s+(?:type\s+)?([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;
  return [...source.matchAll(pattern)].map((m) => ({
    names: m[1],
    specifier: m[2],
  }));
}

const isProjectImport = (specifier: string) =>
  specifier.startsWith('.') || specifier.startsWith('src/');

/** Couches vers lesquelles chaque couche a le droit de pointer (règle de dépendance). */
const ALLOWED_TARGETS: Record<Layer, Layer[]> = {
  domain: ['domain'],
  application: ['domain', 'application'],
};

function targetLayer(file: string, specifier: string): Layer | null {
  const base = specifier.startsWith('src/') ? SRC : dirname(file);
  const target = resolve(base, specifier.replace(/^src\//, ''));
  return layerOf(target + '.ts');
}

// Librairies autorisées dans la couche application : uniquement pour décrire les DTO.
const APPLICATION_PACKAGES = [
  'class-validator',
  'class-transformer',
  '@nestjs/mapped-types',
];

describe('Architecture hexagonale', () => {
  const files = sourceFiles(SRC);

  const domainFiles = files.filter((f) => layerOf(f) === 'domain');
  const applicationFiles = files.filter((f) => layerOf(f) === 'application');

  it('trouve des fichiers à vérifier', () => {
    expect(domainFiles.length).toBeGreaterThan(0);
    expect(applicationFiles.length).toBeGreaterThan(0);
  });

  describe('domain', () => {
    it.each(domainFiles.map((f) => [relative(SRC, f), f]))(
      '%s ne dépend que du domaine',
      (_name, file) => {
        for (const { specifier } of importsOf(file)) {
          if (!isProjectImport(specifier)) {
            throw new Error(
              `Le domaine ne doit importer aucune librairie : "${specifier}"`,
            );
          }
          const layer = targetLayer(file, specifier);
          if (!layer || !ALLOWED_TARGETS.domain.includes(layer)) {
            throw new Error(
              `Le domaine ne doit pas dépendre d'une couche externe : "${specifier}"`,
            );
          }
        }
      },
    );
  });

  describe('application', () => {
    it.each(applicationFiles.map((f) => [relative(SRC, f), f]))(
      "%s ne dépend ni de l'infrastructure ni d'un détail technique",
      (_name, file) => {
        for (const { specifier, names } of importsOf(file)) {
          if (isProjectImport(specifier)) {
            const layer = targetLayer(file, specifier);
            if (!layer || !ALLOWED_TARGETS.application.includes(layer)) {
              throw new Error(
                `Import interdit depuis l'application : "${specifier}"`,
              );
            }
            continue;
          }
          if (APPLICATION_PACKAGES.includes(specifier)) continue;
          // Seul le marqueur d'injection de Nest est toléré.
          if (
            specifier === '@nestjs/common' &&
            names.replace(/[{}\s]/g, '') === 'Injectable'
          )
            continue;
          throw new Error(
            `Librairie interdite dans l'application : "${specifier}" (${names})`,
          );
        }
      },
    );
  });
});
