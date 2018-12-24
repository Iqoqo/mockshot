export function getSafePackageName(packageName: string): string {
  if (packageName.startsWith("@")) {
    return packageName.slice(1);
  }
  return packageName;
}
