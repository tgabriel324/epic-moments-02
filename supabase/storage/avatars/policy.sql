-- Permitir upload de avatares apenas para usuários autenticados
CREATE POLICY "Usuários podem fazer upload de seus próprios avatares"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.fspath(name))[1]);

-- Permitir visualização pública dos avatares
CREATE POLICY "Qualquer um pode ver avatares"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');