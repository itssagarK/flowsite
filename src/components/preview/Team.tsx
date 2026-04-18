import React from 'react';
import { motion } from 'motion/react';
import { useBuilder, TeamMember } from '../../context/BuilderContext';
import { Linkedin, Mail } from 'lucide-react';

export function Team() {
  const { data } = useBuilder();
  const team = data.team || [];

  if (team.length === 0) {
    // Show placeholder if no team data
    return (
      <section id="team" className="py-20 px-8 md:px-20 bg-muted/30">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="max-w-4xl mx-auto text-center">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">Our Team</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Meet The Team</h2>
          <p className="text-muted-foreground">Add your team members in the editor</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="team" className="py-20 px-8 md:px-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="max-w-4xl mx-auto mb-12 text-center">
        <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">Our Team</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Meet The Team</h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {team.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-card border border-border rounded-2xl text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
              {member.name?.charAt(0) || 'T'}
            </div>
            <h3 className="font-bold text-lg text-foreground">{member.name}</h3>
            <p className="text-primary text-sm mb-2">{member.role}</p>
            <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
            <div className="flex items-center justify-center gap-3">
              {member.linkedin && (
                <a href={member.linkedin} className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                  <Linkedin size={16} />
                </a>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`} className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                  <Mail size={16} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}