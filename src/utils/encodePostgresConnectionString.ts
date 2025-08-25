/**
 * Safely encode the password inside a Postgres connection string.
 * Handles special characters (#, @, ?, etc.) and avoids double-encoding.
 *
 * Example:
 *   postgresql://user:pa#ss@host:5432/db
 * → postgresql://user:pa%23ss@host:5432/db
 */
export function encodePostgresConnectionString(conn: string): string {
  try {
    const url = new URL(conn);

    if (url.password) {
      // Decode first, so if it's already encoded (%23) we don't double-encode.
      const decoded = decodeURIComponent(url.password);
      url.password = encodeURIComponent(decoded);
    }

    return url.toString();
  } catch (err) {
    throw new Error(`Invalid connection string: ${err}`);
  }
}
